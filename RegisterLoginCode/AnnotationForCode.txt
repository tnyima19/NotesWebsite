# Import the Flask class from the Flask framework
from flask import Flask, request, jsonify, make_response
# Import SQLAlchemy from Flask-SQLAlchemy for ORM and database interactions
from flask_sqlalchemy import SQLAlchemy
# Import functions for hashing and checking passwords securely
from werkzeug.security import generate_password_hash, check_password_hash

# Create an instance of the Flask class. This instance will be our WSGI application.
app = Flask(__name__)

# Configure the SQLAlchemy database URI for Flask application - SQLite is used here for simplicity
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
# Disable the modification tracker to improve performance
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Initialize the SQLAlchemy extension with the Flask app
db = SQLAlchemy(app)

# Define a User model class to represent user data in the database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Define the primary key column
    username = db.Column(db.String(20), unique=True, nullable=False)  # Define a unique username column
    email = db.Column(db.String(120), unique=True, nullable=False)  # Define a unique email column
    password = db.Column(db.String(60), nullable=False)  # Define a password column

# Define a route for user registration that accepts POST requests
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Get data sent with POST request as JSON
    hashed_password = generate_password_hash(data['password'], method='sha256')  # Hash the provided password
    
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)  # Create new User object
    db.session.add(new_user)  # Add the new user to the database session
    db.session.commit()  # Commit the session to save changes to the database
    
    return jsonify({'message': 'Registered successfully!'}), 201  # Return success message

# Define a route for user login that accepts POST requests
@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization  # Get authorization data from the request
    
    if not auth or not auth.username or not auth.password:  # Check if username or password is missing
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    
    user = User.query.filter_by(username=auth.username).first()  # Query the database for the user
    
    if not user:  # If user is not found
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    
    if check_password_hash(user.password, auth.password):  # Check if the password matches
        return jsonify({'message': 'Login successful!'})  # Return success message
    
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})  # Return error if password doesn't match

# Check if the executed file is the main program and run the Flask application
if __name__ == '__main__':
    db.create_all()  # Create all tables
    app.run(debug=True)  # Run the Flask app in debug mode
