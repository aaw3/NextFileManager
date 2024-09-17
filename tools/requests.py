from flask import Response, jsonify

def response(request_type, status, message):
    if request_type == 'GET':
        return Response(message, status=status)
    elif request_type == 'POST':
        return jsonify(status=status, message=message)

def not_found():
    return Response('404 page not found', status=404)