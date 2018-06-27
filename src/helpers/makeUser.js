const { v4 } = require('uuid')

const makeUser = ({ scopes, name, email }) => {
  const user = {
    name,
    id: v4(),
    scopes
  }
  if (scopes.includes('identity.email')) user.email = email
  return user
}

module.exports = makeUser
