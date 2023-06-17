const express = require("express");

const verifyRegister = require("../middlewares/auth.middleware");
const { registerHandler, loginHandler } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.route("/register")
    .post([verifyRegister], registerHandler);


authRouter.route("/login")
    .post(loginHandler);

module.exports = authRouter;