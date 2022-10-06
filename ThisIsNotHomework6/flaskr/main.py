import requests
from flask import Flask, request, send_from_directory
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/')
def renderHTML():
    return send_from_directory('static','ThisIsNotHomeWork6.html')

key ='6StofwHDTGMV6mmwY7idu1PKnXUdw4CnTe8aGIHq0ewIXa-m6V6HcJqH1CpLQQ4JlTJCpJJj9FpwsOp5sUZBevvCaXRJs2-dAiYXOA96593Nphqj1h6ZNDHPclQtY3Yx'
def getYelpReview(keyWord,distance,category,locationLat,locationLong):
    print(keyWord,distance,category,locationLat,locationLong)
    headers = {"Authorization": "Bearer "+key}
    api= 'https://api.yelp.com/v3/businesses/search?term='+keyWord+'&latitude='+str(locationLat)+'&longitude='+str(locationLong)+'&radius='+str(distance)+'&categories='+category
    return requests.get(api,headers=headers).json()

def getYelpBusinessDets(id):
    print(id)
    headers = {"Authorization": "Bearer "+key}
    api= 'https://api.yelp.com/v3/businesses/'+id
    return requests.get(api,headers=headers).json()


@app.route('/getDets',methods=['GET'])
def getDets():
    print('got req')
    keyWord = request.args.get('keyWord')
    distance = request.args.get('distance')
    category = request.args.get('category')
    locationLat = request.args.get('locationLat')
    locationLong = request.args.get('locationLong')
    res = getYelpReview(keyWord,distance,category,locationLat,locationLong)
    return (res)

@app.route('/getBusinessDets',methods=['GET'])
def getBusinessDets():
    id= request.args.get('id')
    res=getYelpBusinessDets(id)
    print(res)
    return (res)

if __name__ == '__app__':
    app.run()
