var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var google = require('../models/google');
var usIDs = require('../models/usgithub');
var propub = require('../models/propub');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find Your Representative' });
});


/* On submit, send object results */
router.get('/results', function(req, res, next) {
  var address = req.query;

  // CALL API HERE
  google.executeGoogleRequest(address.firstline, address.city, address.state, address.zip, function(error, APIerr, officialArray) {
    if (error) { throw error; }
    else if (APIerr) {
      console.log(APIerr);
    } else {
      // CALL SECOND API HERE
      usIDs.executeUSGithubRequest(officialArray, function(error, APIerr, offficialArray) {
        if (error) { throw error; }
        else if (APIerr) {
          console.log(APIerr);
        } else {

          // CALL THIRD API HERE
          propub.executeProPubRequest(officialArray, function(error, APIerr, officialArray) {
            if (error) { throw error; }
            else if (APIerr) {
              console.log(APIerr);
            } else {
              console.log(officialArray);
              res.render('results', { officialArray: officialArray });
            }
          });
        };
      });
    }
  });
});

module.exports = router;
