const handleHomePage = async (req, res) => {
    return res.render("layout.ejs", { content: 'home.ejs' });
}
module.exports = { handleHomePage }