const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { userType, userStatus } = require("../constants");
const User = require("../models/user.model");
const sendMail = require("../utils/sendMail");


const registerHandler = async (req, res)=>{
    var type = req.body.userType;
    var status;
    if(!type || type === userType.customer){
        status = userStatus.approved;
    }else{
        status = userStatus.pending;
    }

    const newUser = new User({
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
        userType: type,
        userStatus: status
    })

    try{
        await newUser.save();
        res.status(201).send({message: "User registration successful."});
        sendMail({
            subject: 'Registration Successful!',
            to: newUser.email,
            html: `
            <h3>Welcome ${newUser.name},</h3>
            <p>User ID: ${newUser.userId}</p>
            <p>User Type: ${newUser.userType}</p>
            <p>User Status: ${newUser.userStatus}</p>
            `
        })
        return;
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}


const loginHandler = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.body.userId});
        if(!user){
            res.status(404).send({message: "UserId passed is invalid."});
            return;
        }else if(user.userStatus !== userStatus.approved){
            res.status(403).send({message: `User status is ${user.userStatus}`});
            return;
        }else if(cryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(cryptoJS.enc.Utf8) === req.body.password){
            const jwtToken = jwt.sign({userId: user.userId},process.env.JWT_SECRET_KEY);
            const {password, ...rest} = user._doc;
            res.send({...rest,jwtToken});
            return;
        }else{
            res.status(401).send({message: "Invalid password."});
            return;
        }
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

module.exports = {registerHandler, loginHandler};