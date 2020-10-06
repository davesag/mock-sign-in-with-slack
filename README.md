# mock-sign-in-with-slack

A  mock server that emulates the functions of the [Sign-in With Slack](https://api.slack.com/docs/sign-in-with-slack) system. Use this for Integration testing of systems that require Slack sign-in.

See [the official Sign In With Slack](https://api.slack.com/docs/sign-in-with-slack) docs.

## Docker Image

* [`davesag/mock-sign-in-with-slack`](https://hub.docker.com/r/davesag/mock-sign-in-with-slack/)

## Configuration

Set the following environment variables

<!-- prettier-ignore -->
|Variable      |Default     |Notes     |
|--------------|------------|----------|
|`PORT`|`8282`|The port the server listens on|
|`CLIENT_ID`|`test-client-id`|The [client id](https://tools.ietf.org/html/rfc6749#section-2.2). |
|`REDIRECT_URI` | `/show-code` | If supplied then you can leave out the `redirect_uri` param from the `authorize` request below. The default will just redirect to a page that displays the code.  Use this for debugging. |
|`CLIENT_SECRET`|`test-client-secret`|The [client secret](https://tools.ietf.org/html/rfc6749#section-2.3.1). |
|`TEAM_ID` | `test-team-id` | The `team_id` to return with a successful login |
|`SEED_USERS` | none | A `base64` encoded JSON array of users with scopes and codes to use as seed data |

### Seeding Users

Supply an environment variable as follows

```sh
SEED_USERS=W3sibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEB0ZXN0LnRlcyIsInNjb3BlcyI6WyJpZGVudGl0eS5iYXNpYyIsImlkZW50aXR5LmVtYWlsIl0sImNvZGUiOiJhYmNkLTEyMyJ9LHsibmFtZSI6IlRlc3QgQWRtaW4iLCJlbWFpbCI6InRlc3RhZG1pbkB0ZXN0LnRlcyIsInNjb3BlcyI6WyJpZGVudGl0eS5iYXNpYyIsImlkZW50aXR5LmVtYWlsIiwiYWRtaW4iXSwiY29kZSI6ImFiY2QtNjY2In1d
```

This decodes to

```json
[
  {
    "name": "Test User",
    "email": "test@test.tes",
    "scopes": [
      "identity.basic",
      "identity.email"
    ],
    "code": "abcd-123"
  },
  {
    "name": "Test Admin",
    "email": "testadmin@test.tes",
    "scopes": [
      "identity.basic",
      "identity.email",
      "admin"
    ],
    "code": "abcd-666"
  }
]
```

The `mock-sign-in-with-slack` server will pre-load this on startup so your integration tests or whatever can expect some users.

## API

### Get a Code

Your website or app sends a `GET` request to the url

```HTTP
/oauth/authorize?client_id=CLIENT_ID&scope=identity.basic
```

#### Request Params

<!-- prettier-ignore -->
| Param | Required | Notes |
| ----- | -------- | ----- |
| `client_id` | yes | This must match the one you configured with the `CLIENT_ID` environment variable |
| `scope` | yes | This must be at least `identity.basic` but for most uses you'll also want `identity.email`. Multiple scopes must be comma separated (unlike the standard oAuth spec which requires space separated scopes). |
| `redirect_uri` | maybe | The URL encoded redirect uri. If you supplied a `REDIRECT_URI` environment variable then you don't need to supply this param.  If you didn't then we need this param to know how to send you the access code. |
| `state` | no | Put whatever you like in here. |

#### What it does

Checks the `CLIENT_ID` and `scope` and that there is a `redirect_uri` (can have any value), then, if all is good, a mock login form is presented that requests

* `name`
* `email` (returned if the scope includes `identity.email`)

This information is retained in memory only so don't rely on it between server restarts.

The form then redirects back to the supplied `redirect_uri` with the appended `?code=SOME-ACCESS-CODE`

Errors are thrown rather than sent with redirection.

If you don't have a redirection handler ready yet just leave out `redirect_uri` and the default will redirect to a page that just shows you the `code`. Use this as you see fit.

#### A word on Scopes

All that is being mocked here is the ability to sign-in with Slack, and not the full-slack API. The following scopes sre supported:

* `identity.basic` — This is required.
* `identity.email` — You'll want to send this too if you need a user's email address

All other scopes are ignored.  Send multiple scopes as comma-delimited values with the `scope` param. So:

```HTTP
&scope=identity.basic,identity.email
```

### Exchange the Code for a Token

Your UI needs to send the code the mock server sent you to your server which will then send a `application/x-www-form-urlencoded` GET request to

```HTTP
/api/oauth.access?code=THE-CODE-WE-SENT-YOU
```

#### Headers

Use the [`Basic Authentication`](https://tools.ietf.org/html/rfc6749#section-2.3.1) header to provide the `client_id` and `client_secret`. These must match the values defined in the environment variables `CLIENT_ID` and `CLIENT_SECRET` respectively.

To do this you must `base64` encode the string `${client_id}:${client_secret}` and send it in the `Authorisation` header as

```js
Authorization: `Basic ${base64encodedIdAndSecret}`
```

#### Request Params

<!-- prettier-ignore -->
| Param | Required | Notes |
| ----- | -------- | ----- |
| `client_id` | yes | Either send this as a param, or send it in the `Authorization` header (Auth header preferred) |
| `client_secret` | yes | Either this as a param, or send it in the `Authorization` header (Auth header preferred) |
| `code` | yes | this is the `code` we sent you |
| `redirect_uri` | maybe | The URL encoded redirect uri you supplied, if you supplied one. |
| `single_channel` | no | We ignore this as it's just a mock server. |

#### Response

You'll get back something like

```json
{
  "ok": true,
  "access_token": "xoxp-1111827399-16111519414-20367011469-5f89a31i07",
  "scope": "identity.basic",
  "team_id": "T0G9PQBBK"
}
```

### Get the User Details

Once your server has retrieved the token it can then use that token to request additional user data.  Send a `GET` request to

```HTTP
/api/users.identity?token=xoxp-1111827393-16111519414-20367011469-5f89a31i07
```

#### Response

If you set the scope to `identity.basic` you'll get back this response

```json
{
  "ok": true,
  "user": {
    "name": "Some User Name",
    "id": "U0G9QF9C6"
  }
}
```

if you set the scope to both `identity.basic` and `identity.email` you'll get back

```json
{
  "ok": true,
  "user": {
    "name": "Some User Name",
    "id": "U0G9QF9C6",
    "email": "user@test.com"
  }
}
```

### Revoking a Token

Send a `POST` request to

```HTTP
/api/auth.revoke?token=xoxp-2323827393-16111519414-20367011469-5f89a31i07
```

#### Response

```json
{
  "ok": true,
  "revoked": true
}
```

## Development

## Branches

<!-- prettier-ignore -->
| Branch | Tests | Code Coverage | Audit | Comments |
| ------ | ----- | ------------- | ----- | ---------|
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/develop) | [![codecov](https://codecov.io/gh/davesag/mock-sign-in-with-slack/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/mock-sign-in-with-slack) | [![Vulnerabilities](https://snyk.io/test/github/davesag/mock-sign-in-with-slack/develop/badge.svg)](https://snyk.io/test/github/davesag/mock-sign-in-with-slack/develop) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/master) | [![codecov](https://codecov.io/gh/davesag/mock-sign-in-with-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/mock-sign-in-with-slack) | [![Vulnerabilities](https://snyk.io/test/github/davesag/mock-sign-in-with-slack/master/badge.svg)](https://snyk.io/test/github/davesag/mock-sign-in-with-slack/master) | Latest Production Release |

### To build and run locally

Clone this (or better yet, fork it then clone your fork)

```sh
npm install
npm start
```

### `.env` file

You can put environment variables in a `.env` file.

### Testing

* `npm test` to run the unit tests
* `npm run test:server` will run the integration tests
* `npm run lint` will lint it
* `npm run prettier` will prettify it
* `npm run test:unit:cov` will run the unit tests with code coverage
* `npm run test:mutants` will run the mutation tests

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
