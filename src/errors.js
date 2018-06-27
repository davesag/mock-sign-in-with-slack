const ERRORS = {
  // simple errors
  MISSING_CLIENT_ID: 'You must provide a valid client_id',
  INVALID_CLIENT_ID: 'An invalid clientId was supplied',
  INVALID_REQUEST: 'The request is invalid',
  MISSING_REDIRECT_URI: 'You must supply a redirect uri',
  INVALID_REDIRECT_URI: 'The callbck uri supplied is invalid',
  MISSING_CODE: 'You must provide the code we sent you',
  INVALID_CODE: 'The code you sent us is not valid',
  MISSING_TOKEN: 'You must provide the token we sent you',
  INVALID_TOKEN: 'The token you sent us is not valid',
  INVALID_SCOPE: 'You must at least provide the scope "identity.basic"',
  // errors that take params
  GENERIC_ERROR: (path = 'unknown') => `Caught error in path '${path}'`
}

module.exports = ERRORS
