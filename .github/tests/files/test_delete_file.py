from fastapi.testclient import TestClient
from app import app
from tests.helpers import mkfile, rmfile

client = TestClient(app)

def test_delete_file():
    # Create a file to delete
    file_to_delete = "delete_file.txt"
    mkfile((file_to_delete, "File content"))

    # Delete the file
    response = client.delete("/api/file", params={"path": [file_to_delete], "verbose": True})
    assert response.status_code == 200
    assert file_to_delete in response.json()["paths"]["success"]

    # Confirm file no longer exists
    response = client.get("/api/file/read", params={"path": [file_to_delete], "verbose": True})
    assert response.status_code == 404

def test_delete_non_existent_file():
    # Try to delete a non-existent file
    response = client.delete("/api/file", params={"path": ["non_existent_file.txt"], "verbose": True})
    assert response.status_code == 400
    assert "non_existent_file.txt" in response.json()["paths"]["fail"]

def test_delete_multiple_files():
    # Create files
    file1, file2, non_existent_file = "file1.txt", "file2.txt", "non_existent_file.txt"
    mkfile((file1, "File 1 content"), (file2, "File 2 content"))

    # Delete both existing and non-existing files in one call
    response = client.delete("/api/file", params={"path": [file1, file2, non_existent_file], "verbose": True})
    assert response.status_code == 207
    assert file1 in response.json()["paths"]["success"]
    assert file2 in response.json()["paths"]["success"]
    assert non_existent_file in response.json()["paths"]["fail"]

    # Clean up in case deletion failed
    rmfile(file1, file2)
