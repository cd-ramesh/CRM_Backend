const userType = {
    customer: "CUSTOMER",
    engineer: "ENGINEER",
    admin: "ADMIN"
}

const userStatus = {
    approved: "APPROVED",
    pending: "PENDING",
    rejected: "REJECTED"
}

const ticketStatus = {
    open: "OPEN",
    inprogress: "INPROGRESS",
    closed: "CLOSED",
    blocked: "BLOCKED"
}

module.exports = {userType, userStatus, ticketStatus};