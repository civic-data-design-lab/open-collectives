import flask
import json
import database
import psycopg2
from flask_sqlalchemy import SQLAlchemy
import settings as ss
import os
import json
import subprocess

from flask import request, redirect, url_for, flash, render_template
from utils import *

CURRENT_FILE = os.path.abspath(__file__)
CURRENT_DIR = os.path.dirname(CURRENT_FILE)
UPLOAD_FOLDER = CURRENT_DIR + '/static/data/image/'
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}:{port}/{db}'.format(
    user=ss.DATABASE_ADMIN, pw=ss.DATABASE_PWD, url=ss.DATABASE_ADDRESS, port=ss.DATABASE_PORT, db=ss.DATABASE_NAME)

#
DB_CON = psycopg2.connect(database="open-collectives", user="postgres",
                          password="LARM_ghol6lick.jusm",
                          host="daraja-test.cclr5pzf7wtq.us-east-1.rds.amazonaws.com",
                          port=5432)


webapp = flask.Flask(
    __name__,
    static_url_path="",
    static_folder="./static",
    template_folder="templates"
)

webapp.config["DEBUG"] = True

webapp.secret_key = "change this later!"
webapp.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
# silence the deprecation warning
webapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(webapp)
webapp.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@webapp.route("/")
def index():
    return render_template("index.html")


@webapp.route("/film")
def film():
    return render_template("film.html")


@webapp.route("/care")
def care():
    return render_template("care.html")


@webapp.route("/living")
def living():
    return render_template("living.html")


@webapp.route("/market")
def market():
    return render_template("market.html")


@webapp.route("/labor")
def labor():
    return render_template("labor.html")


@webapp.route("/voices", methods=["POST", "GET"])
def voices():
    # answers = {}
    # if request.method == "GET":
    #     answers['labor'] = request.args.getlist("labor")
    #     answers['market'] = request.args.get("market")
    #     answers['care'] = request.args.get("care")
    #     answers['living'] = request.args.getlist("living")

    #     print(answers)

    #     for category in answers:
    #         if answers[category]:
    #             if isinstance(answers[category], str):
    #                 pass
    #             elif isinstance(answers[category], list):
    #                 answers[category] = convert_to_csv(answers[category])
    #             else:
    #                 pass

    #     sql = '''INSERT INTO responses (labor, market, care, living) VALUES (%(labor)s, %(market)s, %(care)s,  %(living)s) RETURNING response_id'''
    #     cur = DB_CON.cursor()

    #     query_data = {
    #         'labor': answers['labor'],
    #         'market': answers['market'],
    #         'care': answers['care'],
    #         'living': answers['living']
    #     }

    #     cur.execute(sql, query_data)

    #     DB_CON.commit()

    return render_template("voices.html")


@webapp.route("/about")
def about():
    return render_template("about.html")

@webapp.route("/responses")
def responses():
    cur = DB_CON.cursor()

    cur.execute('''SELECT response_id, labor, market, care, living FROM responses''')
    response = cur.fetchall()

    DB_CON.commit()

    count = 0
    data = []
    for res in response:

        if not all_false(res):
            pass
        else:
            count += 1
            data.append({"responseID": count,
                         "labor": convert_to_array(res[1]),
                         "market": res[2],
                         'care': res[3],
                         'living': convert_to_array(res[4])})

    return flask.Response(json.dumps(data), mimetype="application/json")

@webapp.route('/survey', methods=['GET'])
def survey():
    answers = {}
    answers['labor'] = request.args.getlist("labor")
    answers['market'] = request.args.get("market")
    answers['care'] = request.args.get("care")
    answers['living'] = request.args.getlist("living")
    
    print(answers)

    for category in answers:
        if answers[category]:
            if isinstance(answers[category], str):
                pass
            elif isinstance(answers[category], list):
                answers[category] = convert_to_csv(answers[category])
            else:
                pass

    sql = '''INSERT INTO responses (labor, market, care, living) VALUES (%(labor)s, %(market)s, %(care)s,  %(living)s) RETURNING response_id'''
    cur = DB_CON.cursor()

    query_data = {
        'labor': answers['labor'],
        'market': answers['market'],
        'care': answers['care'],
        'living': answers['living']
    }
    cur.execute(sql, query_data)

    DB_CON.commit()

    return flask.Response(json.dumps(answers), mimetype="application/json")

@webapp.route("/dimensions")
def home():
    return render_template("dimensions.html")


@webapp.route("/post_collective", methods =['POST'])
#Function to post form input to the postgres database
def post_collective():
    success = database.post_collective()
    # submission_successful = True
    # Redirects back to the home page for flashed message
    response = {'success': success, 'data': database.make_api_from_db()}
    return json.dumps(response)
    # return redirect(url_for('home'))


@webapp.route("/data")
def data():
    # database.upload_json_to_db()  # Only call this once to upload the data to database
    return database.make_api_from_db()

@webapp.route("/pull")
def pull():
    os.chdir('/home/mitcivicdata/webapps/collective_dimensions')
    subprocess.run(['git', 'reset', '--hard', 'HEAD'])
    response = subprocess.check_output(['git','pull'])
    subprocess.run(['touch', 'htdocs/index.py'])
    return response


if __name__ == "__main__":
    webapp.run(debug=True)
