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
  // console.log(val)
  const apiCall = {
    url: 'https://api.yelp.com/v3/autocomplete?text=' + val,
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    res.json({ data: JSON.parse(body), error: err, resp: resp })
  });

});

function getRequest(url) {
  return new Promise(function (success, failure) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        success(body);
      } else {
        failure(error);
      }
    });
  });
}


app.get("/getDets", (req, res) => {
  let keyWord = req.query.keyWord;
  let distance = req.query.distance;
  let category = req.query.category;
  let locationLat = req.query.locationLat;
  let locationLong = req.query.locationLong;
  let location = req.query.location;
  // console.log(keyWord, distance, category, locationLat, locationLong, location);
  const apiKey = 'AIzaSyDGDvD0izXPSz_65z-iZyznuyDlU-D0Qz0'
  const addressURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + apiKey;
  if (locationLat.length <= 0 && location.length > 0) {

    getRequest(addressURL).then(function (data) {
      // do something with body1
      let body1 = JSON.parse(data)
      let loc = body1.results[0].geometry.location
      locationLat = loc.lat;
      locationLong = loc.lng;
      const apiCall = {
        url: 'https://api.yelp.com/v3/businesses/search?term=' + keyWord + '&latitude=' + locationLat.toString() + '&longitude=' + locationLong.toString() + '&radius=' + distance.toString() + '&categories=' + category + '&limit=10',
        headers: { "Authorization": "Bearer " + key }
      };
      return getRequest(apiCall);
    }).then(function (body2) {
      // console.log(body2);
      res.json({ data: JSON.parse(body2) })
    })
  }
  else {
    const apiCall = {
      url: 'https://api.yelp.com/v3/businesses/search?term=' + keyWord + '&latitude=' + locationLat.toString() + '&longitude=' + locationLong.toString() + '&radius=' + distance.toString() + '&categories=' + category + '&limit=10',
      headers: { "Authorization": "Bearer " + key }
    };
    request(apiCall, (err, resp, body) => {
      res.json({ data: JSON.parse(body), error: err, resp: resp })
    });
  }
});

app.get("/getBusinessDets", (req, res) => {
  let id = req.query.id;
  const apiCall = {
    url: 'https://api.yelp.com/v3/businesses/' + id,
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    // console.log(resp)
    res.json({ data: JSON.parse(body), error: err, resp: resp })
  })

});
app.get("/getBusinessReviews", (req, res) => {
  let id = req.query.id;
  // console.log(id)
  const apiCall = {
    url: 'https://api.yelp.com/v3/businesses/' + id + '/reviews',
    headers: { "Authorization": "Bearer " + key }
  };
  request(apiCall, (err, resp, body) => {
    // console.log(resp)
    res.json({ data: JSON.parse(body), error: err, resp: resp })
  });

});
// app.get("/getLocation", (req, res) => {
//   let location = req.query.location;
//   // console.log(id)
//   const addressURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + apiKey;
//   const apiCall = {
//     url: addressURL,
//     // headers: { "Authorization": "Bearer " + key }
//   };
//   request(apiCall, (err, resp, body) => {
//     // console.log(resp)
//     res.json({ data: JSON.parse(body), error: err, resp: resp })
//   });
// });


app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res) => {
  // console.log('in here!!', __dirname)
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
app.set('trust proxy', true);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

