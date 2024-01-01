const db = require("../models");
import { createJWT } from '../middleware/JWTActions';
const handleCompanyLogin = async (companyUserData) => {
    try {
        let username = companyUserData.username;
        let password = companyUserData.password;
        let data = await db.CompanyAccounts.findOne({
            where: {
                username: username
            }
        })
        if (data) {
            if (data.password === password) {
                return {
                    EM: 'Login successfully',
                    EC: '0',
                    DT: createJWT({
                        username: data.username,
                        role: data.role,
                        password: data.password
                    })
                }
            }
            else {
                return {
                    EM: 'Wrong password',
                    EC: '0',
                    DT: '',
                }
            }
        }
        else {
            return {
                EM: 'Not found user',
                EC: '0',
                DT: '',
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { handleCompanyLogin }