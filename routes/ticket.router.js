const express = require("express");

const { verifyJWT } = require("../middlewares/user.middleware");
const {verifyTicket, verifyTicketUpdateRequest} = require("../middlewares/ticket.middleware");
const { createTicket, getAllTickets, getTicketById, updateTicketById } = require("../controllers/ticket.controller");

const ticketRouter = express.Router();

ticketRouter.route("/")
    .post([verifyJWT, verifyTicket], createTicket);

ticketRouter.route("/")
    .get([verifyJWT], getAllTickets);

ticketRouter.route("/:id")
    .get([verifyJWT], getTicketById);

ticketRouter.route("/:id")
    .post([verifyJWT, verifyTicketUpdateRequest], updateTicketById);

module.exports = ticketRouter;