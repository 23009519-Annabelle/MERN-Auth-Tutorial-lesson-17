const jwt = require('jsonwebtoken');
const path = require('path'); // Import the path module for better debugging

// Debugging: Log the resolved path to the userModel file
const userModelPath = path.resolve(__dirname, './models/userModel');
console.log(`Looking for userModel at: ${userModelPath}`);

try {
    const User = require('./models/userModel'); // Attempt to require the module
    console.log('userModel successfully imported!');
} catch (error) {
    console.error('Error importing userModel:', error.message);
    console.error('Full error:', error);
}

const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1]; // "Bearer <token>"
    
    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({ _id }).select('_id');
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth;
