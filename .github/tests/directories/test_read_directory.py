from fastapi.testclient import TestClient
from app import app
from tests.helpers import mkdir, rmdir

client = TestClient(app)

def test_read_directories():
    dir_0, dir_1 = "d0", "d1"
    mkdir(dir_0, dir_1)
    response = client.get("/api/directory", params={"path": [dir_0, dir_1]})
    assert response.status_code == 200
    assert 'directories' in response.json()
    assert all(d in response.json()['directories'] for d in [dir_0, dir_1])
    rmdir(dir_0, dir_1)

def test_read_directory_fail():
    response = client.get("/api/directory", params={"path": ["does_not_exist"]})
    assert response.json() == {"directories": {}}
