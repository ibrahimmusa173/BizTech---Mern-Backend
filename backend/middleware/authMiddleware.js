const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===============================
// Protect Routes (Verify JWT)
// ===============================
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};


// ===============================
// Role Based Authorization
// ===============================
exports.authorizeRoles = (...roles) => {

 return (req, res, next) => {

   if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({
         message: "You are not allowed to perform this action"
      });
   }

   next();
 };
};