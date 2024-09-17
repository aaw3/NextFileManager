import yaml


def load_config(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

flask_config = load_config('configs/flask.yml')
server_config = load_config('configs/server.yml')
users_config = load_config('configs/users.yml')

configs = [flask_config, server_config, users_config]


    



def try_get(key):
    for config in configs:
        if key in config:
            return config[key]

    raise ValueError(f"Could not find value for {key}")