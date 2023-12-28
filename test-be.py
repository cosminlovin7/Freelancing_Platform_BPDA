from flask import Flask, redirect, url_for, session, request, jsonify
from flask_oauthlib.client import OAuth
from flask_login import LoginManager, login_user, login_required, UserMixin, current_user, logout_user
import requests

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
login_manager = LoginManager(app)

google_client_id = '427920577354-6im3cem4crl2lovsslguoe4k77a9inut.apps.googleusercontent.com'
google_client_secret = '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'
google_redirect_uri = 'http://localhost:9191/'

class User(UserMixin):
    pass  # Your user model here

@login_manager.user_loader
def load_user(user_id):
    # Load user from your database
    user = User()
    user.id = user_id
    return user

oauth = OAuth(app)
google = oauth.remote_app(
    'google',
    consumer_key=google_client_id,
    consumer_secret=google_client_secret,
    request_token_params={
        'scope': 'email',
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

@app.route('/')
def index():
    if 'google_token' in session:
        me = google.get('userinfo')
        return jsonify({'data': me.data})
    return 'Hello! Log in with your Google account: <a href="/login">Log in</a>'

@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/login/authorized')
def authorized():
    response = google.authorized_response()
    if response is None or response.get('access_token') is None:
        return 'Login failed.'

    session['google_token'] = (response['access_token'], '')
    me = google.get('userinfo')

    # Check if the user already exists in the database
    user = load_user(me.data['id'])

    if not user:
        # If the user doesn't exist, add them to the database
        user = User()
        user.id = me.data['id']
        login_user(user)

    # Here, 'me.data' contains user information.
    # You can perform registration process using this information if needed.

    return redirect(url_for('index'))

@app.route('/user-session')
@login_required
def getSession():
    return jsonify(session)

@app.route('/logout')
def logout():
    if 'google_token' in session:
        logout_user()
        session.pop('google_token', None)

        return redirect(url_for('index'))
    else:
        return 'Bad request. No session identified.'

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

if __name__ == '__main__':
    app.run(debug=True, port=9191)