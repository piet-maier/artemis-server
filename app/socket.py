from flask_socketio import SocketIO


# TODO: Remove CORS In Production
socketio = SocketIO(cors_allowed_origins="*")
