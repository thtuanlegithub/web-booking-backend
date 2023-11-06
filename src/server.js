import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connection from "./config/connectDB";

const app = express();

//config view engine
configViewEngine(app);

//set up db - sequelize
connection();

//init web routes
initWebRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(">>> Backend is running on the port ", PORT);
})