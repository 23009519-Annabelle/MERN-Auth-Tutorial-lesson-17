const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {

  // verify authentication
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
    const {_id} = jwt.verify(token, process.env.SECRET) //If secret key does not match with the key used for creating token it will throw an error

    req.user = await User.findOne({ _id }).select('_id') // try to get user in db
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'}) //error is most likely here
  }
}
module.exports = requireAuth