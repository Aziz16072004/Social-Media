const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;


    if (token) {
        jwt.verify(token, 'aziz secret code', (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized, no token found' });
            } else {
                
                req.user = decodedToken;
                next();
            }
        });
    } else { 
        return res.status(401).json({ message: 'Unauthorized, no token found' });
    }
};

module.exports = { requireAuth };
