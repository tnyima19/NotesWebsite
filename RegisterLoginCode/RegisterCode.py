from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize the Flask application
app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

# Registration handling
@app.route('/register', methods=['POST'])
def register():
    # Get data from request
    data = request.get_json()
    # Password hash for security
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # User instance creation
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # Response
    return jsonify({'message': 'Account Registration successful!'}), 201

@app.route('/login', methods=['POST'])
def login():
    # Get credentials from request
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response("Unable to verify, try again", 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    # Query the database to find the user
    user = User.query.filter_by(username=auth.username).first()

    if not user:
        return make_response("Unable to verify, try again", 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    # Verify the provided password with the hashed password in the database
    if check_password_hash(user.password, auth.password):
        return jsonify({'message': 'Login successful!'})
    
    # Respond with an error if the password is incorrect
    return make_response("Unable to verify, try again", 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

# Main 
if __name__ == '__main__':
    with app.app_context():  # Create an application context
        db.create_all()  # Now you can call db.create_all() within the context
    app.run(debug=True)
