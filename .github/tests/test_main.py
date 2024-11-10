from fastapi.testclient import TestClient
from app import app
from app import ROOT_DIRECTORY as ud
import os
import shutil

client = TestClient(app)

# Create tests to verify API endpoints in app.py are working

def test_read_directories():
    dir_0 = "d0"
    dir_1 = "d1"
    mkdir(dir_0, dir_1)
    response = client.get(f"/api/directory?path={dir_0}&path={dir_1}")
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
    response = client.post("/api/directory?verbose=True", json={"path": [dir_to_create1, dir_to_create2]})
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
    response = client.post("/api/directory?verbose=True", json={"path": [f"../{dir_to_create}"]})
    assert response.status_code == 403 # Forbidden accessing out of user scope

# Trying to create a directory with same name as a file
def test_create_directory_file_exists_fail():
    file_to_create = "create_file0"
    mkfile((file_to_create, ""))
    response = client.post("/api/directory?verbose=True", json={"path": [file_to_create]})
    assert response.status_code == 400
    assert file_to_create in response.json()['paths']['fail']
    #rmfile(file_to_create)

def test_multistatus_response():
    file_to_create = "create_file0"
    dir_to_create = "create_dir0"
    mkfile((file_to_create, ""))
    response = client.post("/api/directory?verbose=True", json={"path": [file_to_create, dir_to_create]})
    assert response.status_code == 207
    assert file_to_create in response.json()['paths']['fail']
    assert dir_to_create in response.json()['paths']['success']
    rmfile(file_to_create)
    rmdir(dir_to_create)

def test_read_directory_fail():
    dir_to_check = 'does_not_exist'
    response = client.get(f"/api/directory?path={dir_to_check}")
    assert response.json() == {"directories": {}}



def test_read_file_unbuffered():
    pass

def test_read_file_buffered():
    pass



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