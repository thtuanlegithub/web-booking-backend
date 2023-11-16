import packageService from "../services/packageService";
const handleCreatePackage = async (req, res) => {
    try {
        await packageService.createNewPackage(req.body);
        return res.redirect("/package");
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    handleCreatePackage
}