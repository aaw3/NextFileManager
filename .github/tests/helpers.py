import os
from app import ROOT_DIRECTORY as ud

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
