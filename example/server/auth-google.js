var request = require('request');

var PRIVATE_KEY = 'PRIVATE_KEY_HERE'

var access_token_endpoint = 'https://accounts.google.com/o/oauth2/token';

var api_endpoint = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

function fetch_token (params) {
  return new Promise(function (resolve, reject) {
    var options = {
      url: access_token_endpoint,
      form: params,
      json: true
    };

    request.post(options, function (err, res, token) {
      if (err) {
        reject(err);
        return;
      }
      if (res.statusCode !== 200) {
        reject(res.body);
        return;
      }
      resolve(token.access_token);
    });
  });
}

function fetch_profile (token) {
  return new Promise(function (resolve, reject) {
    var options = {
      url: api_endpoint,
      headers: {
        Authorization: 'Bearer ' + token
      },
      json: true
    };

    request.get(options, function (err, res, profile) {
      if (err) {
        reject(err);
        return;
      }
      if (res.statusCode !== 200) {
        reject(res.body);
        return;
      }
      resolve(profile);
    });
  });
}

module.exports = function (app) {

  app.post('/auth/google', function (req, res, next) {

    var params = {
      client_id: req.body.client_id,
      code: req.body.code,
      redirect_uri: req.body.redirect_uri,
      client_secret: PRIVATE_KEY,
      grant_type: 'authorization_code'
    };

    fetch_token(params)
      .then(fetch_profile)
      .then(function (profile) { res.send(profile); })
      .catch(function (err) { res.status(500).send(err); });

  });

};