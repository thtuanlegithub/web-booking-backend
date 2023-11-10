import packageService from '../services/packageService';
const handleHomePage = async (req, res) => {
    return res.render("layout.ejs", { content: 'home.ejs' });
}
const handleTravelPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'travel.ejs' });
}
const handleTourPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'tour.ejs' });
}
const handlePackagePage = async (req, res) => {
    let page = 1;
    if (req.query.page == null) {
        page = 1;
    }
    else {
        page = req.query.page;
    }
    let packageList = await packageService.getPackageList(page);
    let totalNumber = await packageService.getTotalNumber();
    return res.render("layout.ejs", { content: 'package.ejs', packageList: packageList, totalNumber: totalNumber });
}
const handleDiscountPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'discount.ejs' });
}
const handleAccountPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'account.ejs' });
}
const handleBookingPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'booking.ejs' });
}
const handleInvoicePage = async (req, res) => {
    return res.render("layout.ejs", { content: 'invoice.ejs' });
}
const handleCustomerPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'customer.ejs' });
}
const handleStatisticsPage = async (req, res) => {
    return res.render("layout.ejs", { content: 'statistics.ejs' });
}
module.exports = {
    handleHomePage, handleTravelPage, handleTourPage, handlePackagePage, handleDiscountPage, handleAccountPage, handleBookingPage, handleInvoicePage, handleCustomerPage, handleStatisticsPage
}