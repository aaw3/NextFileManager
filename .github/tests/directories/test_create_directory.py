from fastapi.testclient import TestClient
from app import app
from tests.helpers import mkdir, rmdir, mkfile, rmfile

client = TestClient(app)

def test_create_directories():
    dir_to_create1, dir_to_create2 = "create_dir0", "create_dir1"
    response = client.post("/api/directory", json={"path": [dir_to_create1, dir_to_create2]}, params={"verbose": True})
    assert response.status_code == 200
    assert all(d in response.json()['paths']['success'] for d in [dir_to_create1, dir_to_create2])
    rmdir(dir_to_create1, dir_to_create2)

def test_create_directory_oob_fail():
    response = client.post("/api/directory", json={"path": ["../create_dir0"]}, params={"verbose": True})
    assert response.status_code == 403  # Forbidden accessing out of user scope

def test_create_directory_file_exists_fail():
    file_to_create = "create_file0"
    mkfile((file_to_create, ""))
    response = client.post("/api/directory", json={"path": [file_to_create]}, params={"verbose": True})
    assert response.status_code == 400
    rmfile(file_to_create)
