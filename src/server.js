import express from 'express';
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connection from "./config/connectDB";
import initApiRoutes from "./routes/api";
import bodyParser from 'body-parser';
import configCors from './config/cors';
require("dotenv").config();
const cors = require('cors');

if (typeof window !== 'undefined') {
    const { v4: uuidv4 } = require('uuid');
    window.uuid = { v4: uuidv4 };
}

const app = express();

// configCors(app);

// Bổ sung các origin muốn cho phép truy cập
const allowedOrigins = [process.env.REACT_URL, process.env.CUSTOMER_URL];

const corsOptions = {
    origin: function (origin, callback) {
        // Cho phép truy cập nếu origin nằm trong danh sách allowedOrigins hoặc không có origin (cho những request không gửi từ trình duyệt, như XMLHttpRequest từ JavaScript).
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: 'X-Requested-With,content-type',
    credentials: true,
};

// Sử dụng CORS middleware
app.use(cors(corsOptions));



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