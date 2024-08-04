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
        res.status(201).send(newTicket);
        return;
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

const getAllTickets = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.userId});
        if(user.userType === userType.admin){
            const tickets = await Ticket.find({}).cache(30);
            res.send(tickets);
            return;
        }
        var query;
        if(user.userType === userType.customer){
            query = {requester: req.userId};
        }else{
            query = {$or:[{assignee: req.userId}, {requester: req.userId}]};
        }
        const tickets = await Ticket.find(query).cache(30);
        res.send(tickets);
        return;
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

const getTicketById = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.userId});
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            res.status(404).send({message: "Ticket ID is invalid"});
            return;
        }
        if(user.userType === userType.admin || user.userId === ticket.assignee || user.userId === ticket.requester){
            res.send(ticket);
            return;
        }else{
            res.status(403).send({message: "Access to the ticket is restricted due to lack of authorization."});
            return;
        }
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}

const updateTicketById = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.userId});
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            res.status(404).send({message: "Ticket ID is invalid"});
            return;
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
            await ticket.save();
            res.send(ticket);
        }else{
            res.status(403).send({message: "Updating the ticket is not permitted due to lack of authorization."});
            return;
        }
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
        return;
    }
}


module.exports = {createTicket, getAllTickets, getTicketById, updateTicketById};