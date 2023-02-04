const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Kisspog';

const fetchuser = (req, res, next) => {
    // get user with auth-token in req.header
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({error: "Invalid token"})
    }
    try {
         const data = jwt.verify(token, JWT_SECRET);
    req.user= data.user;
    next();
    } catch (e) {
        return res.status(401).json({error: "Invalid token"})
    }
   
}

module.exports = fetchuser;
