import os
import pytest
from app import secure_path, MAX_UNCOMPRESSED_SIZE

@pytest.fixture(scope="module", autouse=True)
def create_test_files():
    """Creates sample files for testing."""
    small_file = secure_path("small.txt")
    large_file = secure_path("large.txt")

    # Write small file
    with open(small_file, "w") as f:
        f.write("This is a small file.")

    # Write large file (larger than MAX_UNCOMPRESSED_SIZE)
    with open(large_file, "wb") as f:
        f.write(b"A" * (MAX_UNCOMPRESSED_SIZE + 1024))

    yield  # Wait for tests to run

    # Clean up files after tests
    os.remove(small_file)
    os.remove(large_file)
