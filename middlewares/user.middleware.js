const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { userType } = require("../constants");

const verifyJWT = (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        res.status(403).send({message: "No token provided."});
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload)=>{
        if(err){
            res.status(403).send({message: "Token provided is invalid."});
            return;
        }
        req.userId = payload.userId;
        next();
    })
}

const verifyAdmin = async (req, res, next)=>{
    try{
        const userId = req.userId;
        const user = await User.findOne({userId});
        if(user.userType === userType.admin){ 
            next();
            return;
        }
        res.status(403).send({message: "Cannot proceed further due to lack of authorization."});
        return;
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

const verifyAdminOrOwnUser = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const user = await User.findOne({userId: req.userId});
        if(!user){
            res.status(404).send({message: "ID passed is invalid."});
            return;
        }
        if(user.userType === userType.admin || user._id === id){
            next();
            return;
        }
        res.status(403).send({message: "Cannot proceed further due to lack of authorization."})
        return;
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

module.exports = {verifyJWT, verifyAdmin, verifyAdminOrOwnUser};