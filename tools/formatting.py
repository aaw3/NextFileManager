from flask import request

def get_parsed_host():
    host = request.headers.get('Host')
    host = host.split(':')[0] if ':' in host else host
    return host

def get_formatted_size(size):
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024.0:
            break
        size /= 1024.0
    return f"{size:.2f} {unit}"

def get_values_from_form(value_name):
    return request.values.to_dict(flat=False)[value_name]