import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookiePerser from "cookie-parser"
const app = express()
// require('dotenv').config();
dotenv.config()

const connect = async () => { //initial connection. if this connection ok then connect with mongoDB.
    try {
        await mongoose.connect(process.env.MONGO); //'mongodb://127.0.0.1:27017/test'
        console.log('connected to MongoDB')
    } catch (error) {
        throw error //if there is any problem to conncet, code will crush here. not will go for further mongoDB.
    }
};

mongoose.connection.on("disconnected",()=>{
    console.log('mongoDB disconnected');
})
// mongoose.connection.on("connected",()=>{
//     console.log('mongoDB connected');
// })

//middlewares
app.use(cookiePerser())
app.use(express.json())

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);

// Error handleing middleware
app.use((err,req,res,next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "something went worng!!!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
})

app.listen(8800, () => {
    connect();
    console.log('connected to backend port!! 8800')
})