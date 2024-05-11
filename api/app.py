from flask import Flask, jsonify, request, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, current_user
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import firebase_admin
from firebase_admin import credentials, firestore
import bcrypt

# Initialize Firebase Admin
cred = credentials.Certificate('./firebase/notescape-login-firebase-adminsdk-xnnk4-466ffeb27b.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'

login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    # Your user loading logic from Firestore
    pass

class MyModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    users_ref = db.collection('users')
    docs = users_ref.where('username', '==', data['username']).stream()
    for doc in docs:
        if doc.to_dict().get('username') == data['username']:
            return jsonify({'message': 'User already exists'}), 400
    
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    user_data = {
        'username': data['username'],
        'email': data['email'],
        'password': password_hash.decode('utf-8'),
    }
    users_ref.add(user_data)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # Add user login logic here, if managing sessions through Flask
    return jsonify({'message': 'Logged in successfully'}), 200

admin = Admin(app, name='MyAdmin', template_mode='bootstrap3')

if __name__ == '__main__':
    app.run(debug=True)