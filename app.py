from flask import Flask, render_template
import requests, json

app = Flask(__name__)

@app.route('/')
def home():
    data = requests.get('https://rumobile.rutgers.edu/1/indexes/92013_NB_U.json').json()
    return render_template('index.html', json=json.dumps(data))

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
