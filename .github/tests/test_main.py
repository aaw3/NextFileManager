from fastapi.testclient import TestClient
import app
from app import app, BUFFER_SIZE, MAX_UNCOMPRESSED_SIZE, MAX_ZIP_MEMORY_SIZE, secure_path
from app import ROOT_DIRECTORY as ud
import os
import shutil
import pytest
import tempfile
import zipfile
from io import BytesIO

client = TestClient(app)

# Save original values to restore after tests
ORIGINAL_BUFFER_SIZE = BUFFER_SIZE
ORIGINAL_MAX_UNCOMPRESSED_SIZE = MAX_UNCOMPRESSED_SIZE
ORIGINAL_MAX_ZIP_MEMORY_SIZE = MAX_ZIP_MEMORY_SIZE

# Temporarily modify the values for testing
BUFFER_SIZE = 1024  # 1 KB for small chunks
MAX_UNCOMPRESSED_SIZE = 1024 * 2  # 2 KB to test unbuffered small files
MAX_ZIP_MEMORY_SIZE = 1024 * 4  # 4 KB for small ZIP files in memory

# Create tests to verify API endpoints in app.py are working

@pytest.fixture(scope="module", autouse=True)
def create_test_files():
    """Creates sample files for testing."""
    small_file =  secure_path("small.txt")
    large_file = secure_path("large.txt")

    # Write small file
    with open(small_file, "w") as f:
        f.write("This is a small file.")

    # Write large file (larger than MAX_UNCOMPRESSED_SIZE)
    with open(large_file, "wb") as f:
        f.write(b"A" * (MAX_UNCOMPRESSED_SIZE + 1024))

    # Wait for tests to run
    yield

    # Clean up files after tests
    os.remove(small_file)
    os.remove(large_file)



def test_read_directories():
    dir_0 = "d0"
    dir_1 = "d1"
    mkdir(dir_0, dir_1)
    response = client.get(f"/api/directory", params={"path": [dir_0, dir_1]})
    assert response.status_code == 200
    assert response.json() is not None
    assert 'directories' in response.json()
    assert all(d in response.json()['directories'] for d in [dir_0, dir_1])
    try:
        rmdir(dir_0, dir_1)
    except Exception:
        pass

def test_create_directories():
    dir_to_create1 = "create_dir0"
    dir_to_create2 = "create_dir1"
    response = client.post("/api/directory", json={"path": [dir_to_create1, dir_to_create2]}, params={"verbose": True})
    assert response.status_code == 200
    assert all(d in response.json()['paths']['success'] for d in [dir_to_create1, dir_to_create2])
    try:
        rmdir(dir_to_create1, dir_to_create2)
    except Exception:
        pass

# If directoy already exists, it won't fail
# If directory cannot be created, it will fail
# Directory out of bounds check
def test_create_directory_oob_fail():
    dir_to_create = "create_dir0"
    response = client.post("/api/directory", json={"path": [f"../{dir_to_create}"]}, params={"verbose": True})
    assert response.status_code == 403 # Forbidden accessing out of user scope

# Trying to create a directory with same name as a file
def test_create_directory_file_exists_fail():
    file_to_create = "create_file0"
    mkfile((file_to_create, ""))
    response = client.post("/api/directory", json={"path": [file_to_create]}, params={"verbose": True})
    assert response.status_code == 400
    assert file_to_create in response.json()['paths']['fail']
    #rmfile(file_to_create)

def test_multistatus_response():
    file_to_create = "create_file0"
    dir_to_create = "create_dir0"
    mkfile((file_to_create, ""))
    response = client.post("/api/directory", json={"path": [file_to_create, dir_to_create]}, params={"verbose": True})
    assert response.status_code == 207
    assert file_to_create in response.json()['paths']['fail']
    assert dir_to_create in response.json()['paths']['success']
    rmfile(file_to_create)
    rmdir(dir_to_create)

def test_read_directory_fail():
    dir_to_check = 'does_not_exist'
    response = client.get(f"/api/directory", params={"path": [dir_to_check]})
    assert response.json() == {"directories": {}}


def test_read_single_file_unbuffered_nodownload():
    """Tests reading a small file with unbuffered response."""
    small_file_path = "small.txt"

    # Store original values and modify BUFFER_SIZE temporarily
    global BUFFER_SIZE
    original_buffer_size = BUFFER_SIZE
    BUFFER_SIZE = 1024  # Set a small buffer size for this test

    try:
        response = client.get("/api/file/read", params={"path": [small_file_path], "nodl": "true"})
        assert response.status_code == 200
        assert "Content-Disposition" not in response.headers
        assert response.content == b"This is a small file."
    finally:
        BUFFER_SIZE = original_buffer_size  # Restore original BUFFER_SIZE


def test_read_single_file_streaming():
    """Tests reading a large file with streaming response."""
    large_file_path = "large.txt"

    # Temporarily adjust MAX_UNCOMPRESSED_SIZE for this test
    global MAX_UNCOMPRESSED_SIZE
    original_max_uncompressed_size = MAX_UNCOMPRESSED_SIZE
    MAX_UNCOMPRESSED_SIZE = 1024 * 2  # 2 KB for this test

    try:
        response = client.get("/api/file/read", params={"path": [large_file_path]})
        assert response.status_code == 200
        assert response.headers["Content-Disposition"] == f"attachment; filename={os.path.basename(large_file_path)}"
    finally:
        MAX_UNCOMPRESSED_SIZE = original_max_uncompressed_size  # Restore original value


def test_read_multiple_files_zipped():
    """Tests reading multiple files in a ZIP archive."""
    small_file_path = "small.txt"
    large_file_path = "large.txt"

    # Temporarily adjust MAX_ZIP_MEMORY_SIZE for this test
    global MAX_ZIP_MEMORY_SIZE
    original_max_zip_memory_size = MAX_ZIP_MEMORY_SIZE
    MAX_ZIP_MEMORY_SIZE = 1024 * 4  # 4 KB for this test

    try:
        response = client.get("/api/file/read", params={"path": [small_file_path, large_file_path]})
        assert response.status_code == 200
        assert response.headers["Content-Disposition"].startswith("attachment; filename=NextFileManager-")
        assert response.headers["Content-Type"] == "application/zip"
        
        # Check if response is in a valid ZIP format
        zip_content = BytesIO(response.content)
        with zipfile.ZipFile(zip_content, "r") as zipf:
            assert "small.txt" in zipf.namelist()
            assert "large.txt" in zipf.namelist()
    finally:
        MAX_ZIP_MEMORY_SIZE = original_max_zip_memory_size  # Restore original value



def rmdir(*args):
    for d in args:
        try:
            os.rmdir(f"{ud}/{d}")
        except Exception:
            pass

def mkdir(*args):
    for d in args:
        os.makedirs(f"{ud}/{d}")

def rmfile(*args):
    for f in args:
        try:
            os.remove(f"{ud}/{f}")
        except Exception:
            pass

def mkfile(*args):
    for file_name, data in args:
        with open(f"{ud}/{file_name}", "w") as file:
            file.write(data)

def rmtree(*args):
    for d in args:
        try:
            shutil.rmtree(f"{ud}/{d}")
        except Exception:
            pass