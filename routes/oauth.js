var express = require('express')
var router = express.Router();
const request = require('request');
var User = require('../models/user')

class LinkedInAPI {

  /**
   * Class constructor
   *
   * @param client_id
   * @param client_secret
   * @param redirect_uri
   * @param api_host
   * @param api_resource
   * @param oauth_url
   */
  constructor(client_id, client_secret, redirect_uri, api_host = 'https://api.linkedin.com', api_resource = '/v2', oauth_url = 'https://www.linkedin.com/oauth/v2') {
    this.url = api_host + api_resource;
    this.oauth_url = oauth_url;
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;

    if (!this.client_id) throw new Error('Missing "client_id" during initialization!');
    if (!this.client_secret) throw new Error('Missing "client_secret" during initialization!');
    if (!this.redirect_uri) throw new Error('Missing "redirect_uri" during initialization!');
  }

  /**
   * Get authorization URL
   *
   * @param scope
   * @param state
   * @returns {string}
   */
  getAuthorizationUrl(scope, state) {
    if (!Array.isArray(scope)) throw new Error('Scope must be an array');
    const scope_string = encodeURIComponent(scope.join(','));
    const state_string = encodeURIComponent(state);
    const redirect_uri = encodeURIComponent(this.redirect_uri);
    return `${this.oauth_url}/authorization?response_type=code&client_id=${this.client_id}&redirect_uri=${redirect_uri}&state=${state_string}&scope=${scope_string}`;
  }

  /**
   * Get access token: https://developer.linkedin.com/docs/oauth2
   *
   * @param code
   * @param state
   * @returns {Promise<Object>}
   */
  async getAccessToken(code, state) {
    if (!code) throw new Error('Code parameter cannot be empty');
    const url = `${this.oauth_url}/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${this.redirect_uri}&client_id=${this.client_id}&client_secret=${this.client_secret}`;
    return this.invoke('POST', url, {'content-type': 'application/x-www-form-urlencoded'});
  }

  /**
   * Invokes the given rest URL endpoint with the given body and headers
   *
   * @param {string} method - The HTTP verb (i.e. GET/POST)
   * @param {string} url - The uri endpoint for the HTTP service
   * @param {object} headers - The HTTP headers (i.e. {'random-header-name': 'random-header-value', 'content-type': 'application/json'})
   * @param {object} body - The JSON data to POST if applicable, or null
   * @param {object} auth - An object to pass to make a call which requires authorization, example { withAuth: true, access_token: 'access_token' }
   *
   * @returns {object} The body of the HTTP response
   */
  invoke(method, url, headers = {'Content-Type': 'Application/json'}, body = {}, auth = {
    withAuth: false,
    access_token: null
  }) {
    return new Promise((resolve, reject) => {
      let options;
      try {
        options = this.generateOptions(method, url, headers, body, auth);
      } catch (err) {
        return reject(err);
      }
      request(options, (error, response, body) => {
        if (error) return reject(error);
        if (response.statusCode === 404) return resolve(null);
        if (response.statusCode !== 200 && response.statusCode !== 201) return reject(new Error(response.statusCode + ' ' + response.statusMessage + ': ' + JSON.stringify(body)));
        try {
          const data = JSON.parse(body);
          // console.log(data);
          return resolve(data);
        } catch (err) {
          return reject(err)
        }
      });
    });
  }

  /**
   * Generates the required options for invoking HTTP/HTTPS requests
   *
   * @param {string} method - The HTTP verb (i.e. GET/POST)
   * @param {string} url - The uri endpoint for the HTTP service
   * @param {object} headers - The HTTP headers (i.e. {'random-header-name': 'random-header-value', 'content-type': 'application/json'})
   * @param {object} body - The JSON data to POST if applicable, or null
   * @param {object} auth - An object to pass to make a call which required authorization, example { withAuth: true, access_token: 'access_token' }
   *
   * @returns {object} The HttpOptions JSON object
   */
  generateOptions(method, url, headers, body, auth) {
    headers['X-Restli-Protocol-Version'] = '2.0.0';
    if (auth.withAuth) {
      if (!auth.access_token) throw new Error('Missing required "access_token" in the auth body');
      headers['Authorization'] = `Bearer ${auth.access_token}`;
    }
    const options = {url, method, headers};
    if (body) options['body'] = JSON.stringify(body);
    return options;
  }


  /**
   * Retrieve current member's profile
   *
   * @param fields
   * @param access_token
   * @returns {Promise<Object>}
   */
  async getCurrentMemberProfile(fields, access_token) {
    // console.log(access_token)
    if (!access_token) throw new Error('Access code cannot be empty');
    if (!Array.isArray(fields)) throw new Error('Parameter "fields" must be an array');
    //https://api.linkedin.com/v2/me?projection=(id,firstName,lastName)
    const url = `${this.url}/me?projection=(${fields.join(',')})`;
    const url2 = `${this.url}/emailAddress?q=members&projection=(elements*(handle~))`;
    // https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))
    let email=this.invoke('GET', url2, undefined, undefined, {withAuth: true, access_token});
    let profile=this.invoke('GET', url, undefined, undefined, {withAuth: true, access_token});
    return Promise.all([email, profile])
  }
};

const LINKEDIN_CLIENT_ID = "776wjnff7ois17";
const LINKEDIN_CLIENT_SECRET = "UwEOv8EeIkUpfiMb";
const LINKEDIN_CALLBACK_URL = "https://ancient-caverns-78426.herokuapp.com/auth/linkedin/callback";
const linkedInAPI = new LinkedInAPI(LINKEDIN_CLIENT_ID,LINKEDIN_CLIENT_SECRET,LINKEDIN_CALLBACK_URL);

// Construct url and redirect to the auth dialog
router.get("/", (req, res) => {
  try {
    var scope = ['r_liteprofile', 'r_emailaddress', 'w_member_social'];
    const authURL = linkedInAPI.getAuthorizationUrl(scope, 'state')
    return res.send(authURL);
  } catch (error) {
    res.send("Unable to getAuthUrl:" + error);
  }
});

// Get 'code' querystring parameter and hit data api
router.get("/callback", async (req, res) => {

  try {

    linkedInAPI.getAccessToken(req.query.code, req.query.state)
      .then(response => {
        linkedInAPI.getCurrentMemberProfile(['id', 'firstName', 'lastName'], response.access_token)
          .then(response => {
            User.findOne({email: response[0]["elements"][0]["handle~"]["emailAddress"] }, function (err, user) {
              if (err) {
                console.log(err)
              } else {
                if (!user) {
                  new User({
                    email: response[0]["elements"][0]["handle~"]["emailAddress"],
                    isVerified: true,
                    oauth: true,
                    oauthToken: req.query.code
                  }).save(function (err, user) {
                      if (err)
                        return res.status(401)
                      return res.redirect(`https://noq-client.herokuapp.com/oauth/${user.email}/${req.query.code}`)
                  })
                } else {
                  User.updateOne({email: response[0]["elements"][0]["handle~"]["emailAddress"]}, {$set: {oauthToken: req.query.code}}, function (err, succ) {
                    if (err)
                      return res.status(401)
                    return res.redirect(`https://noq-client.herokuapp.com/oauth/${user.email}/${req.query.code}`)
                  })
                }
              }
            })
          })
      })
      .catch(err => {
        console.log("linkedin-redirect getAccessToken error:" + err);
      });

  } catch (error2) {
    console.log("linkedin-redirect getAccessToken error2:" + error2);
  }

});

module.exports = router;

// app.listen(8080, () => console.log("https://noq-client.herokuapp.com/auth/linkedin"));
