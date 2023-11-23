import express from 'express';
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connection from "./config/connectDB";
import initApiRoutes from "./routes/api";
import bodyParser from 'body-parser';
if (typeof window !== 'undefined') {
    const { v4: uuidv4 } = require('uuid');
    window.uuid = { v4: uuidv4 };
}

const app = express();

//config view engine
configViewEngine(app);

//set up db - sequelize
connection();
//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//init web routes
initWebRoutes(app);
initApiRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(">>> Server is running at port ", PORT);
})

export default app;