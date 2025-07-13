
// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler"); // IMPORTANT: Keep this line

// The actual middleware function
const authMiddleware = asyncHandler(async (req, res, next) => { // Keep wrapped in asyncHandler
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401);
        throw new Error("No token, authorization denied");
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500);
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const decoded = jwt.verify(token, jwtSecret);
        
        // Ensure that the user ID is correctly attached.
        // The `decoded` object typically contains the user ID (e.g., `_id` or `id`)
        // from when the token was signed.
        req.user = decoded; // Attach the decoded user payload to the request.
                            // You will access the user's ID as `req.user._id` in controllers.

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            res.status(401);
            throw new Error("Token is not valid");
        }
        res.status(500);
        throw err;
    }
});

// --- CRUCIAL FIX: Export as a named 'protect' property ---
module.exports = { protect: authMiddleware }; // <--- THIS LINE IS NOW ACTIVE!
// module.exports = authMiddleware;             // <--- THIS LINE IS NOW COMMENTED OUT!