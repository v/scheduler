from flask import Flask, render_template, request
import requests, json

app = Flask(__name__)
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

@app.route('/')
def home():
    return render_template('index.html.jade')

@app.route('/list')
def list():
    if 'course' in request.args:
        assert 'subj' in request.args
        data = requests.get('http://sis.rutgers.edu/soc/course.json', params={
            'campus': 'NB',
            'semester': '92013',
            'level': 'U,G',
            'subject': request.args['subj'],
            'courseNumber': request.args['course'],
        }).json()

        result = [data]
        subject = request.args['subj']
        course = request.args['course']

    elif 'subj' in request.args:
        data = requests.get('http://sis.rutgers.edu/soc/courses.json', params={
            'campus': 'NB',
            'semester': '92013',
            'level': 'U,G',
            'subject': request.args['subj'],
        }).json()

        result = data
        subject = request.args['subj']
        course = ""
    else:
        return 'You done goofed'

    return render_template('list.html.jade', data=result,
            subject=subject,
            course=course)

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
