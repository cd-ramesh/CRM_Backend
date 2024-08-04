const express = require("express");
const connectDB = require("./config/dbconfig");
const { default: mongoose } = require("mongoose");
const cachegoose = require('recachegoose');
const cors = require("cors");
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const ticketRouter = require("./routes/ticket.router");

cachegoose(mongoose, {
    engine: 'memory'
});

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/tickets",ticketRouter);

const PORT = 8000;

app.get("/",(req, res)=>{
    res.send("Hello!!");
});

mongoose.connection.once("open",()=>{
    console.log("Connected to DB");
    app.listen(process.env.PORT || PORT,()=>{
        console.log("Server is UP and running");
    })
});