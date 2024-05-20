const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

// set origin 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))

// set json data limit
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
// public assets
// app.use(express.static("public"));
app.use(cookieParser());


// REST API entry point
routes.registerRoutes(app);

module.exports = app;