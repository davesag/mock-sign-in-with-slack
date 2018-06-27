# mock-sign-in-with-slack

A very simple mock server that emulates the functions of the Sign-in With Slack system.  use this for Integration testing systems that require simple Slack sign-in.

See [the official Sign In With Slack](https://api.slack.com/docs/sign-in-with-slack) docs.

_This is a work in progress: When you see a green light next to `master` then it's done._

## Branches

| Branch | Tests | Code Coverage | Comments |
| ------ | ----- | ------------- | ---------|
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/develop) | [![codecov](https://codecov.io/gh/davesag/mock-sign-in-with-slack/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/mock-sign-in-with-slack) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/mock-sign-in-with-slack/tree/master) | [![codecov](https://codecov.io/gh/davesag/mock-sign-in-with-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/mock-sign-in-with-slack) [![Greenkeeper badge](https://badges.greenkeeper.io/davesag/mock-sign-in-with-slack.svg)](https://greenkeeper.io/) | Latest Production Release |

## Docker Image

* [`davesag/mock-sign-in-with-slack`]() _not done yet_

## Configuration

Set the following environment variables

|Variable|Default|Notes|
|--------------|------------|----------|
|`PORT`|8282|The port the server listens on|
|`CLIENT_ID`|`test-client-id`|The [client id](https://tools.ietf.org/html/rfc6749#section-2.2). |
|`REDIRECT_URI` |  | If supplied then you can leave out the `redirect_uri` param from the `authorize` request below |
|`CLIENT_SECRET`|`test-client-secret`|The [client secret](https://tools.ietf.org/html/rfc6749#section-2.3.1). |
|`MATCH_SCOPE`| | Email fragments and their associated scopes.  E.g. `"MATCH_SCOPE" : "@admin:admin"` will tell the oAuth server to allow anyone with email address `*@admin*` to have the scope `'admin'` if requested |
|`TEAM_ID` | | The `team_id` to return with a successful login |

## API

### Get a Code

Your UI sends a GET request to the url

```
/oauth/authorize?client_id=CLIENT_ID&scope=identity.basic
```

#### Request Params

| Param | Required | Notes |
| ----- | -------- | ----- |
| `client_id` | yes | This must match the one you configured with the `CLIENT_ID` environment variable |
| `scope` | yes | This must be at least `identity.basic` but for most uses you'll also want `identity.email`. Multiple scopes must be comma separated (unlike the standard oAuth spec which requires space separated scopes). |
| `redirect_uri` | maybe | The URL encoded redirect uri. If you supplied a `REDIRECT_URI` environment variable then you don't need to supply this param.  If you didn't then we need this param to know how to send you the access code. |
| `state` | no | Put whatever you like in here. |

#### What it does

We check the `CLIENT_ID` and `scope` and that there is a `redirect_uri` (we don't care what it is), then, if all is good, we present the user a mock login form that requests

* `name`
* `email` (if the scope includes `identity.email`)
* `isAdmin` (if the scope includes `admin`)

We keep this information in memory (important to note we don't bother persisting this data so don't rely on it beyond the initial auth flow)

Then we redirect back to the supplied `redirect_uri` with the appended `?code=SOME-ACCESS-CODE`

If the login request is not successful (because of mismatched `client_id`, etc) we redirect back with `?error=SOME-ERROR-CODE` instead.

#### A word on Scopes

As all we are mocking here is the ability to sign-in with Slack, and not the full-slack API, we only care about the following scopes

* `identity.basic` — This is required.
* `identity.email` — You'll want to send this too if you need a user's email address
* `admin` — If the user is an admin you'll want them to have this scope.

We ignore all other scopes for now.  Send multiple scopes as comma-delimited values with the `scope` param. So:

`&scope=identity.basic,identity.email`

### Exchange the Code for a Token

Your UI needs to send the code we sent you to a server (you need to build this) which will then send a `application/x-www-form-urlencoded` GET request to

```
/api/oauth.access?code=THE-CODE-WE-SENT-YOU
```

#### Headers

You must use the [`Basic Authentication`](https://tools.ietf.org/html/rfc6749#section-2.3.1) header to provide the `client_id` and `client_secret`. These must match the values defined in the environment variables `CLIENT_ID` and `CLIENT_SECRET` respectively.

To do this you must `base64` encode the string `${client_id}:${client_secret}` and send it in the `Authorisation` header as

```
Authorization: `Basic ${base64encodedIdAndSecret}`
```

#### Request Params

| Param | Required | Notes |
| ----- | -------- | ----- |
| `client_id` | yes | Either send this as a param, or send it in the `Authorization` header (Auth header preferred) |
| `client_secret` | yes | Either this as a param, or send it in the `Authorization` header (Auth header preferred) |
| `code` | yes | this is the `code` we sent you |
| `redirect_uri` | maybe | The URL encoded redirect uri you supplied, if you supplied one. |
| `single_channel` | no | We ignore this as it's just a mock server. |

#### Response

You'll get back something like

```
{
  "ok": true,
  "access_token": "xoxp-1111827399-16111519414-20367011469-5f89a31i07",
  "scope": "identity.basic",
  "team_id": "T0G9PQBBK"
}
```

### Get the User Details

Once your server has retreived the token it can then use that token to request additional user data.  Send a GET request to

```
/api/users.identity?token=xoxp-1111827393-16111519414-20367011469-5f89a31i07
```

#### Response

If you set the scope to `identity.basic` you'll get back this response

```
{
  "ok": true,
  "user": {
    "name": "Some User Name",
    "id": "U0G9QF9C6"
  },
  "team": {
    "id": "T0G9PQBBK"
  }
}
```

if you set the scope to both `identity.basic` and `identity.email` you'll get back

```
{
  "ok": true,
  "user": {
    "name": "Some User Name",
    "id": "U0G9QF9C6",
    "email": "user@test.com"
  },
  "team": {
    "id": "T0G9PQBBK",
  }
}
```

### Revoking a Token

Send a POST request to

```
/api/auth.revoke?token=xoxp-2323827393-16111519414-20367011469-5f89a31i07
```

#### Response

```
{
  "ok": true,
  "revoked": true
}
```

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
