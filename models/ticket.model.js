const { default: mongoose } = require("mongoose");
const { ticketStatus } = require("../constants");


const ticketSchema = new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    ticketPriority: {type: Number, enum: [1,2,3], default: 3},
    requester: {type: String, require: true},
    assignee: {type: String, require: true},
    ticketStatus: {type: String, default: ticketStatus.open}
},{
    timestamps: true
})

const Ticket = mongoose.model("Ticket",ticketSchema);

module.exports = Ticket;