# pip install -U flask-cors
# for installing cors
from ast import keyword
import json
import requests
from flask import Flask, request, jsonify,make_response
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def getYelpReview(keyWord,distance,category,locationLat,locationLong):
    print(keyWord,distance,category,locationLat,locationLong)
    key ='6StofwHDTGMV6mmwY7idu1PKnXUdw4CnTe8aGIHq0ewIXa-m6V6HcJqH1CpLQQ4JlTJCpJJj9FpwsOp5sUZBevvCaXRJs2-dAiYXOA96593Nphqj1h6ZNDHPclQtY3Yx'
    headers = {"Authorization": "Bearer "+key}
    api= 'https://api.yelp.com/v3/businesses/search?term='+keyWord+'&latitude='+str(locationLat)+'&longitude='+str(locationLong)+'&radius='+str(distance)+'&categories='+category
    return requests.get(api,headers=headers).json()
@app.route('/getDets',methods=['GET'])
def getDets():
    keyWord = request.args.get('keyWord')
    distance = request.args.get('distance')
    category = request.args.get('category')
    locationLat = request.args.get('locationLat')
    locationLong = request.args.get('locationLong')
    # keyWord = 'delis'
    # distance = 10000
    # category = 'delis'
    # locationLat = 37.786882
    # locationLong = -122.399972
    res = getYelpReview(keyWord,distance,category,locationLat,locationLong)
    return (res)

if __name__ == '__main__':
    app.run()