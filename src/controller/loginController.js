import loginService from '../services/loginService';
const handleCompanyLogin = async (req, res) => {
    try {
        let data = await loginService.handleCompanyLogin(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.log("Error handleCompanyLogin Controller", error);
    }
}

module.exports = { handleCompanyLogin }