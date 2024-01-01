require('dotenv').config();
import jwt from 'jsonwebtoken';
const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    try {
        let token = jwt.sign(payload, key);
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
}
const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let data = null;
    jwt.verify(token, key, function (error, decoded) {
        if (error) {
            console.log(error);
            return data;
        }
        console.log(decoded);
        return decoded;
    })
}
module.exports = {
    createJWT, verifyToken
}