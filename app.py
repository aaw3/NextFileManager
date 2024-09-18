from flask import Flask, request, render_template, jsonify, flash, send_from_directory, send_file, redirect, url_for, Response
#from flask_wtf import FlaskForm
#from wtforms import SubmitField
from werkzeug.utils import secure_filename
import os
from pathlib import Path
from functools import wraps
import datetime
from mime_types import mime_types
from tools.formatting import get_formatted_size, get_parsed_host, get_values_from_form
from tools.io import is_safe_path, get_styling_path, try_get_config_value
from tools.requests import response, not_found
from tools.config import flask_config, server_config
import tools.config

app = Flask(__name__, subdomain_matching=False)
#app.config.from_object('config.Config')
app.config.update(flask_config)
#SERVER_NAME = try_get_config_value(server_config, 'DOMAIN_NAME') + ':' + str(try_get_config_value(server_config, 'PORT'))
#app.config['SERVER_NAME'] = SERVER_NAME

safe_dir = os.path.abspath(try_get_config_value(server_config, 'UPLOAD_FOLDER', 'uploads'))
styling_dir = try_get_config_value(server_config, 'STYLING_FOLDER', 'styling')



@app.template_filter('datetimeformat')
def datetimeformat(value):
    return datetime.datetime.fromtimestamp(value).strftime('%Y-%m-%d %H:%M:%S')

# Register the filter
app.jinja_env.filters['datetimeformat'] = datetimeformat

@app.route('/', methods=['GET'])
def index():
    return redirect(url_for('view_files', req_path=''))

@app.route('/view', methods=['GET'], defaults={'req_path': ''})
@app.route('/view/<path:req_path>', methods=['GET'])
def view_files(req_path):

    base_dir = os.path.abspath(try_get_config_value(server_config,'UPLOAD_FOLDER'))
    abs_path = os.path.join(base_dir, req_path)

    print("Requested path:", req_path)

    print(abs_path, safe_dir, is_safe_path(abs_path, safe_dir))

    # Check if the path is safe
    if not is_safe_path(abs_path, safe_dir):
        print("Unsafe path:", abs_path)
        return not_found()

    # If is path and viewing is disabled
    if not try_get_config_value(server_config, 'VIEW_DIRECTORIES') and os.path.isdir(abs_path):
        return not_found()

    if not os.path.exists(abs_path):
        return not_found()

    if os.path.isfile(abs_path):
        filetype = os.path.splitext(abs_path)[1][1:]
        if filetype in mimetypes:
            return send_file(abs_path, mimetype=mimetypes[filetype])
        return send_file(abs_path) # Don't set mimetype for unknown file types, browser will handle it

    dirs = []
    files = []
    # Show directory contents
    try:
        _dir = os.listdir(abs_path)
        for item in _dir:
            item_path = os.path.join(abs_path, item)
            if os.path.isdir(item_path):
                dirs.append({
                    'name': item,
                    'mtime': os.path.getmtime(item_path)
                })
            else:
                files.append({
                'name': item,
                'size': get_formatted_size(os.path.getsize(item_path)),
                'mtime': os.path.getmtime(item_path)
                })

    except OSError:
        return not_found()

    print(files, dirs)
    return render_template('files.html', files=sorted(files, key=lambda x: x['name']),
                           dirs=sorted(dirs, key=lambda x: x['name']), path=req_path, get_styling_path=get_styling_path)

@app.route('/upload', methods=['GET'])
def upload_file():
    return render_template('upload.html')
    
#@app.route('/delete/<path:delete_path>', methods=['GET'])
#def delete_file_from_get(delete_path):
#    return delete_file([delete_path], request_type='GET')

# Would need to get the path from path value in form
@app.route('/delete', methods=['POST'])
def delete_file_from_post():
    delete_paths = get_values_from_form('path')

    return delete_file(delete_paths, request_type='POST')

#@app.route('/delete_dir/<path:delete_path>', methods=['GET'])
#def delete_directory_from_get(delete_path):
#    return delete_directory([delete_path], request_type='GET')

@app.route('/delete_dir', methods=['POST'])
def delete_directory_from_post():
    delete_paths = get_values_from_form('path')

    return delete_directory(delete_paths, request_type='POST')



@app.route('/' + try_get_config_value(server_config,'STYLING_PATH') + '/<path:file_path>', methods=['GET'])
def get_styling_file(file_path):
    path = os.path.abspath(styling_dir + '/' + file_path)
    print(path + " : " + str(is_safe_path(path, safe_dir)))
    if is_safe_path(path, safe_dir=os.path.abspath(styling_dir)) and os.path.exists(path) and not os.path.isdir(path):
        return send_file(path)
    return not_found()




@app.route('/upload', methods=['POST'])
def handle_file_upload():
    files = request.files.to_dict(flat=False)
    print("Received files:", files.items())

    succeeded = []
    failed = []
    
    for field_name, file_list in files.items():
        for file in file_list:
            path = os.path.abspath(Path(try_get_config_value(server_config,'UPLOAD_FOLDER')) / Path(field_name))
            
            # Validate the full path
            if not is_safe_path(path, safe_dir):
                failed.append([field_name, "Invalid path"])
                continue

            os.makedirs(path, exist_ok=True)
            filename = secure_filename(file.filename)
            file_path = os.path.join(path, filename)
            
            # Validate the final file path
            if not is_safe_path(file_path, safe_dir):
                failed.append([filename, "Invalid path"])
                continue

            with open (file_path, 'wb') as f:
                while True:
                    chunk = file.stream.read(try_get_config_value(server_config,'UPLOAD_CHUNK_SIZE'))
                    if not chunk:
                        break
                    f.write(chunk)

            print('Saved file to:', file_path)
            succeeded.append(filename)

    return response('POST', 200 if len(failed) == 0 else 400, {'succeeded': succeeded, 'failed': failed})


def delete_file(filenames, request_type):
    succeeded = []
    failed = []
    for filename in filenames:
        file_path = os.path.join(try_get_config_value(server_config,'UPLOAD_FOLDER'), filename)

        # Validate the file path
        if not is_safe_path(file_path, safe_dir):
            failed.append([filename, "Invalid path"])
            continue
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print ("Deleted: ", filename)
                succeeded.append(filename)
            except IsADirectoryError:
                failed.append([filename, "Is a directory"])
            except OSError as e:
                failed.append([filename, str(e)])
        else:
            failed.append([filename, "File not found"])

    if request_type == 'POST':
        return response(request_type, 200, {'succeeded': succeeded, 'failed': failed})
    elif request_type == 'GET':
        # Only one file can be deleted using GET method
        if len(succeeded) > 0:
            return response(request_type, 200, 'Deleted: ' + succeeded[0])
        if len(failed) > 0:
            return response(request_type, 400, 'Failed to delete: ' + failed[0][0] + ' - ' + failed[0][1])



def delete_directory(dirnames, request_type):
    succeeded = []
    failed = []

    for dirname in dirnames:
        dir_path = os.path.join(try_get_config_value(server_config,'UPLOAD_FOLDER'), dirname)

        # Validate the directory path
        if not is_safe_path(dir_path, safe_dir):
            failed.append([dirname, "Invalid path"])
            continue

        if os.path.exists(dir_path):
            try:
                os.rmdir(dir_path)
                print("Deleted directory: ", dirname)
                succeeded.append(dirname)
            except OSError as e:
                failed.append([dirname, str(e)])
            
        else:
            failed.append([dirname, "Directory not found"])
    
    if request_type == 'POST':
        return response(request_type, 200, {'succeeded': succeeded, 'failed': failed})
    elif request_type == 'GET':
        # Only one directory can be deleted using GET method
        if len(succeeded) > 0:
            return response(request_type, 200, 'Deleted: ' + succeeded[0])
        if len(failed) > 0:
            return response(request_type, 400, 'Failed to delete: ' + failed[0][0] + ' - ' + failed[0][1])


if __name__ == '__main__':
    app.run(debug=True)