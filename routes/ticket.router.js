const express = require("express");

const { verifyJWT } = require("../middlewares/user.middleware");
const {verifyTicket, verifyTicketUpdateRequest} = require("../middlewares/ticket.middleware");
const { createTicket, getAllTickets, getTicketById, updateTicketById } = require("../controllers/ticket.controller");

const ticketRouter = express.Router();

ticketRouter.route("/",[verifyJWT, verifyTicket])
    .post(createTicket);

ticketRouter.route("/",[verifyJWT])
    .get(getAllTickets);

ticketRouter.route("/:id",[verifyJWT])
    .get(getTicketById);

ticketRouter.route("/:id",[verifyJWT, verifyTicketUpdateRequest])
    .post(updateTicketById);

module.exports = ticketRouter;