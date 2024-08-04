const { userType } = require("../constants");
const User = require("../models/user.model");


const verifyTicket = (req, res, next)=>{
    if(!req.body.title){
        res.status(400).send({message: "Please provide Title."});
        return;
    }
    if(!req.body.description){ 
        res.status(400).send({message: "Please provide Description."});
        return;
    }
    
    next();
}

module.exports = {verifyTicket};