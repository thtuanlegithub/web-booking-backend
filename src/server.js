import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";

const app = express();

//config view engine
configViewEngine(app);


//init web routes
initWebRoutes(app);


const PORT = 8080;
app.listen(PORT, () => {
    console.log(">>> Backend is running on the port ", PORT);
})