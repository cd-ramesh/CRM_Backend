const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const { userType, userStatus } = require("../constants");


const createTicket = async (req, res)=>{
    try{
        const newTicket = new Ticket({
            title: req.body.title,
            description: req.body.description,
            ticketPriority: req.body.ticketPriority,
            requester: req.userId,
        });
        const engineers = await User.find({
            userType: userType.engineer,
            userStatus: userStatus.approved
        });
        newTicket.assignee = engineers[Math.floor(Math.random()*engineers.length)].userId;
        await newTicket.save();
        res.send(201).send(newTicket);
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}

const getAllTickets = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.userId});
        if(user.userType === userType.admin){
            const tickets = await Ticket.find({});
            res.send(tickets);
        }
        var query;
        if(user.userType === userType.customer){
            query = {requester: req.userId};
        }else{
            query = {$or:[{assignee: req.userId}, {requester: req.userId}]};
        }
        const tickets = await User.find(query);
        res.send(tickets);
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}

const getTicketById = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.userId});
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            res.status(404).send({message: "Ticket ID is invalid"});
        }
        if(user.userType === userType.admin || user.userId === ticket.assignee || user.userId === ticket.requester){
            res.send(ticket);
        }else{
            res.status(403).send({message: "Access to the ticket is restricted due to lack of authorization."})
        }
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}

const updateTicketById = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.userId});
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            res.status(404).send({message: "Ticket ID is invalid"});
        }
        if(user.userType === userType.admin || user.userId === ticket.assignee || user.userId === ticket.requester){
            ticket.title = req.body.title ? req.body.title : ticket.title;
            ticket.description = req.body.description ? req.body.description : ticket.description;
            ticket.ticketPriority = req.body.ticketPriority ? req.body.ticketPriority : ticket.ticketPriority;
            if(user.userId !== ticket.requester){
                ticket.ticketStatus = req.body.ticketStatus ? req.body.ticketStatus : ticket.ticketStatus;
            }
            if(user.userType === userType.admin){
                ticket.assignee = req.body.assignee ? req.body.assignee : ticket.assignee;
            }
        }else{
            res.status(403).send({message: "Updating the ticket is not permitted due to lack of authorization."})
        }
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}


module.exports = {createTicket, getAllTickets, getTicketById, updateTicketById};