from flask import Flask, render_template, request
import requests, json, pyjade

app = Flask(__name__)
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

@app.template_filter('timefix')
def timefix_filter(time):
  time = time[:2] + ':' + time[2:]
  return time.lstrip('0')

@app.route('/')
def home():
    return render_template('index.html.jade')

@app.route('/list')
def list():
    if 'campus' not in request.args:
        return 'You need a campus', 400

    if 'course' in request.args:
        if 'subj' not in request.args:
            return 'You need a subject and a course number', 400
        data = requests.get('http://sis.rutgers.edu/soc/course.json', params={
            'campus': request.args['campus'],
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
            'campus': request.args['campus'],
            'semester': '92013',
            'level': 'U,G',
            'subject': request.args['subj'],
        }).json()

        result = data
        subject = request.args['subj']
        course = ""
    else:
        return 'You need a subj parameter dood', 400

    return render_template('list.html.jade', data=result,
            subject=subject,
            course=course)

if __name__ == '__main__':
    app.run('0.0.0.0', port=12345, debug=True)
