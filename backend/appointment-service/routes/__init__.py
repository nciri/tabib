from routes.appointment_routes import appointment_bp

def register_routes(app):
    app.register_blueprint(appointment_bp, url_prefix='/appointments')
