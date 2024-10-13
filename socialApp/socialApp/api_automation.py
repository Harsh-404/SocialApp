import requests

# Define the login URL and the API endpoint
login_url = 'http://127.0.0.1:8000/api/token/'
api_url = 'http://127.0.0.1:8000/users/'

# User credentials
credentials = {
    'username': 'your_username',
    'password': 'your_password'
}

# Obtain the token
response = requests.post(login_url, data=credentials)
token = response.json().get('token')

if token:
    # Use the token to make an authenticated request
    headers = {
        'Authorization': f'Token {token}'
    }
    api_response = requests.get(api_url, headers=headers)

    # Check if the request was successful
    if api_response.status_code == 200:
        users = api_response.json()
        
        # Process the user data
        for user in users:
            print(f"ID: {user['id']}, Username: {user['username']}, Email: {user['email']}")
    else:
        print(f"Failed to fetch users: {api_response.status_code}")
else:
    print('Failed to obtain token')
