require('dotenv').config();
import jwt from 'jsonwebtoken';
const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    try {
        let token = jwt.sign(payload, key);
        console.log(token);
        return token;
    } catch (error) {
        return null;
    }
}
const verifyToken = (token) => {
    try {
        let key = process.env.JWT_SECRET;
        let data = null;
        jwt.verify(token, key, function (error, decoded) {
            if (error) {
                return data;
            }
            console.log(decoded);
            return decoded;
        })
    } catch (error) {
        return null;
    }
}
module.exports = {
    createJWT, verifyToken
}