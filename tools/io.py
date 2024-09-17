from tools.config import server_config
from os import getenv
import os

def is_safe_path(path, safe_dir):
    # Check if the path is within the upload folder
    return os.path.commonprefix((os.path.realpath(path), safe_dir)) == safe_dir

def get_styling_path(path):
    return os.path.join('/' + try_get_config_value(server_config, 'STYLING_PATH'), path)

def try_get_config_value(config, key, default=None):
    value = None
    if config:
        value = config.get(key, default)
        if value:
            return value
    value = os.getenv(key)
    if value:
        return value

    if default:
        return default
    
    raise ValueError(f"Could not find value for {key}")