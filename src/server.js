import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
// const expressLayouts = require('express-ejs-layouts');

const app = express();

//config view engine
configViewEngine(app);

//layout
// app.use(expressLayouts);
// app.set('layout', 'layout.ejs')

//init web routes
initWebRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(">>> Backend is running on the port ", PORT);
})