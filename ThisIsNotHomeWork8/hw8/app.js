const express = require("express");
const path = require('path');
var cors = require('cors');
var request = require("request");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
const key = '6StofwHDTGMV6mmwY7idu1PKnXUdw4CnTe8aGIHq0ewIXa-m6V6HcJqH1CpLQQ4JlTJCpJJj9FpwsOp5sUZBevvCaXRJs2-dAiYXOA96593Nphqj1h6ZNDHPclQtY3Yx'
app.get("/getOptionsList", (req, res) => {
  let val = req.query.text;
  console.log(val)
  const apiCall = {
    url: 'https://api.yelp.com/v3/autocomplete?text=' + val,
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    res.json({data:JSON.parse(body),error:err,resp:resp})
  });

});
app.get("/getDets", (req, res) => {
  let keyWord= req.query.keyWord;
  let distance= req.query.distance;
  let category= req.query.category;
  let locationLat= req.query.locationLat;
  let locationLong= req.query.locationLong;
  console.log(keyWord,distance,category,locationLat,locationLong)
  const apiCall = {
    url: 'https://api.yelp.com/v3/businesses/search?term='+keyWord+'&latitude='+locationLat.toString()+'&longitude='+locationLong.toString()+'&radius='+distance.toString()+'&categories='+category,
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    res.json({data:JSON.parse(body),error:err,resp:resp})
  });

});

app.get("/getBusinessDets", (req, res) => {
  let id= req.query.id;
  let respJson={}
  const apiCall = {
    url: 'https://api.yelp.com/v3/businesses/'+id,
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    console.log(resp)
    res.json({data:JSON.parse(body),error:err,resp:resp})
  })

});
app.get("/getBusinessReviews", (req, res) => {
  let id= req.query.id;
  console.log(id)
  const apiCall = {
    url: 'https://api.yelp.com/v3/businesses/'+id+'/reviews',
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    console.log(resp)
    res.json({data:JSON.parse(body),error:err,resp:resp})
  });

});

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res) => {
  console.log('in here!!', __dirname)
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
app.set('trust proxy', true);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

