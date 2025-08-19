// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

const protectSeller = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get seller from the token and attach it to the request object
            req.seller = await Seller.findById(decoded.id).select('-password');
            
            if (!req.seller) {
                return res.status(401).json({ error: 'Not authorized, seller not found' });
            }

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

module.exports = { protectSeller };
