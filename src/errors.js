const ERRORS = {
  // simple errors
  INVALID_CLIENT_ID: 'An invalid clientId was supplied',
  INVALID_REQUEST: 'The request is invalid',
  MISSING_CALLBACK_URL: 'You must supply a callback url',
  // errors that take params
  GENERIC_ERROR: (path = 'unknown') => `Caught error in path '${path}'`
}

module.exports = ERRORS
