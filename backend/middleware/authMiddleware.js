import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    // Grab token from authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request object
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401)
                throw new Error('Token expired')
            } else {
                res.status(401);
                throw new Error('Not authorized, invalid token');
            }
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token found');
    }
})

export { protect }