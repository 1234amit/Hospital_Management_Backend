import express from 'express'
import colors from "colors";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import morgan from "morgan";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";


// configure env
dotenv.config();

//database connection
connectDB();

// rest object
const app = express();

// middlewares
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes imports
import userRoutes from './routes/userRoutes.js';

app.use("/api/v1/user", userRoutes);

// rest api
app.get("/", (req, res) => {
    res.send("<h1>Wellcome to my Ecommerce app</h1>")
});

// port
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on Port ${PORT}`.bgCyan
        .white)
})