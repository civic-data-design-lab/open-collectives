from flask import request, flash
import json
import settings
import webapp
import os
from werkzeug.utils import secure_filename
import requests
from apiKey import reCaptcha


CURRENT_FILE = os.path.abspath(__file__)
CURRENT_DIR = os.path.dirname(CURRENT_FILE)
db = webapp.db


class Collective(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(), nullable=True)
    image = db.Column(db.String(), nullable=False)
    value_porosity = db.Column(db.Integer, nullable=False)
    value_economics = db.Column(db.Integer, nullable=False)
    value_size = db.Column(db.Integer, nullable=False)
    value_platform = db.Column(db.Integer, nullable=False)
    value_governance = db.Column(db.Integer, nullable=False)

    def __init__(self, title, description, image, value_porosity, value_economics, value_size, value_platform, value_governance):
        self.title = title 
        self.description = description 
        self.image = image
        self.value_porosity = value_porosity 
        self.value_economics = value_economics
        self.value_size = value_size
        self.value_platform = value_platform
        self.value_governance = value_governance

    def __repr__(self):
        return '<Collective %r>' % self.title



def make_api_from_data():
    f = open(CURRENT_DIR+"/static/data/4_14_extract.json", encoding="utf8")
    data = json.load(f)
    f.close()
    return {"data": data}


def make_api_from_db():
    data = Collective.query.all()
    collectives = []
    titles = []
    for collective in data:
        jsn = vars(collective)  # The returned object is of class Collective
        # This is added by database and we won't need it
        del jsn['_sa_instance_state']
        jsn['values'] = {}  # we are taking it back to our original format
        # Creating a copy of the json so that we don't mutate the dictionary we are iterating upon
        jsn_cpy = dict(jsn)
        for k in jsn_cpy:
            if 'value_' in k:
                jsn['values'][k.replace('value_', '')] = jsn[k]
                del jsn[k]
        if jsn['title'] not in titles:
            collectives.append(jsn)
            titles.append(jsn['title'])

    # Since flask view can't return list, we convert it to dictionary
    return {"data": collectives}


def upload_json_to_db():
    f = open(CURRENT_DIR+"/static/data/4_14_extract.json", encoding="utf8")
    data = json.load(f)
    db.create_all()
    # Since sql tables cannot store nested objects, we are converting all the value inside values to the first level of the object
    for item in data:
        for key in item['values']:
            item['value_'+key] = item['values'][key]
        # Now we don't need values as we added all values to main dictionary itself
        item.pop('values', None)
        item.pop('id', None)  # We don't need background, SQL provides that
        item.pop('backgroundImage', None)  # We don't need background
        it = Collective(**item)
        db.session.add(it)
    db.session.commit()
    f.close()
    return data

#Have to add new collective to the database
def post_collective():
	#Make sure both are not null (required to upload a pic in some way)
    captcha = requests.post('https://www.google.com/recaptcha/api/siteverify', data = {'secret':reCaptcha, 'response':request.form['FormCaptcha']})
    response = json.loads(captcha.content)
    if not response['success'] or response['hostname'] not in request.url_root:
        print ("Something")
        return False
    if (request.form['FormPicUrl'] != ''):
        url = request.form['FormPicUrl']
        filename = secure_filename(url.split('/')[-1].split('?')[0])
        while os.path.exists(os.path.join(webapp.webapp.config['UPLOAD_FOLDER'], filename)):
            filename='new_'+filename
        file = requests.get(url)
        open(os.path.join(webapp.webapp.config['UPLOAD_FOLDER'], filename), 'wb').write(file.content)
    elif (request.files['FormPic'] != ''):
        file = request.files['FormPic']
        filename = secure_filename(file.filename)
        file.save(os.path.join(webapp.webapp.config['UPLOAD_FOLDER'], filename))
    collective = Collective(request.form['FormName'],request.form['FormDescription'],filename,request.form['FormPorous'],request.form['FormEcon'],request.form['FormSize'],request.form['FormPlatform'],request.form['FormGovern'])
    #Add object to the database
    db.session.add(collective)
    #Save the object
    try:
        db.session.commit()
        success = True
    except Exception as e:
        print (e)
        db.session.rollback()
        print ("other thing")
        success = False
    finally:
        pass
        # db.session.close()
    return success
