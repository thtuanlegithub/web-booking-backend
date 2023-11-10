import express from 'express';
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connection from "./config/connectDB";
import initApiRoutes from "./routes/api";

const app = express();

//config view engine
configViewEngine(app);

//set up db - sequelize
connection();

//init web routes
initWebRoutes(app);
initApiRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(">>> Server is running at port ", PORT);
})

export default app;