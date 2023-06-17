const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { userType } = require("../constants");

const verifyJWT = (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token)
        res.status(403).send({message: "No token provided."});
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload)=>{
        if(err)
            res.status(403).send({message: "Token provided is invalid."})
        req.userId = payload.userId;
        next();
    })
}

const verifyAdmin = async (req, res, next)=>{
    try{
        const userId = req.userId;
        const user = await User.findOne({userId});
        if(user.userType === userType.admin) 
            next();
        res.status(403).send({message: "Cannot proceed further due to lack of authorization."});
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}

const verifyAdminOrOwnUser = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user){
            res.status(404).send({message: "ID passed is invalid."});
        }
        if(user.userType === userType.admin || user.userId === req.userId)
            next();
        res.send(403).send({message: "Cannot proceed further due to lack of authorization."})
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}

module.exports = {verifyJWT, verifyAdmin, verifyAdminOrOwnUser};