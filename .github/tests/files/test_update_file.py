# Example of an update test if your API supports renaming files

from fastapi.testclient import TestClient
from app import app
from tests.helpers import mkfile, rmfile

client = TestClient(app)

def test_rename_file():
    original_file = "original.txt"
    renamed_file = "renamed.txt"
    mkfile((original_file, ""))
    response = client.patch("/api/file", json={original_file: renamed_file}, params={"verbose": True})
    print(response.json(), response.status_code)
    rmfile(renamed_file)
    assert response.status_code == 200
    #assert renamed_file in response.json()["files"]

def test_rename_duplicate_file():
    original_file = "original.txt"
    renamed_file = "renamed.txt"
    mkfile((original_file, ""), (renamed_file, ""))
    response = client.patch("/api/file", json={original_file: renamed_file}, params={"verbose": True})
    rmfile(original_file, renamed_file)
    assert response.status_code == 400