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

const verifyTicketUpdateRequest = async (req, res, next)=>{
    try{
        const userId = req.userId;
        const user = await User.findOne({userId: userId});
        const type = user.userType;
        if(type === userType.engineer || type === userType.customer){
            if(req.body.assignee){
                res.status(403).send({message: "Cannot change the assignee due to lack of authorization"});
                return;
            }
        }
        if(type === userType.customer){
            if(req.body.ticketStatus){
                res.status(403).send({message: "Cannot change the ticket status due to lack of authorization"});
                return;
            }
        }
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

module.exports = {verifyTicket, verifyTicketUpdateRequest};