from fastapi.testclient import TestClient
from app import app
from tests.helpers import mkdir, rmdir

client = TestClient(app)

def test_delete_directory():
    # Create a directory to delete
    dir_to_delete = "delete_dir"
    mkdir(dir_to_delete)

    # Delete the directory
    response = client.delete("/api/directory", params={"path": [dir_to_delete], "verbose": True})
    print(response.json())
    assert response.status_code == 200
    assert dir_to_delete in response.json()["paths"]["success"]

    # Confirm directory no longer exists
    response = client.get("/api/directory", params={"path": [dir_to_delete]})
    assert response.json() == {"directories": {}}

def test_delete_non_existent_directory():
    # Try to delete a non-existent directory
    response = client.delete("/api/directory", params={"path": ["non_existent_dir"], "verbose": True})
    assert response.status_code == 400
    assert "non_existent_dir" in response.json()["paths"]["fail"]

def test_delete_multiple_directories():
    # Create directories
    dir1, dir2, non_existent_dir = "dir1", "dir2", "non_existent_dir"
    mkdir(dir1, dir2)

    # Delete both existing and non-existing directories in one call
    response = client.delete("/api/directory", params={"path": [dir1, dir2, non_existent_dir], "verbose": True})
    assert response.status_code == 207
    assert dir1 in response.json()["paths"]["success"]
    assert dir2 in response.json()["paths"]["success"]
    assert non_existent_dir in response.json()["paths"]["fail"]

    # Clean up in case deletion failed
    rmdir(dir1, dir2)
