const express = require("express");

const { verifyJWT, verifyAdmin, verifyAdminOrOwnUser } = require("../middlewares/user.middleware");
const { getAllUsers, getUserById, updateUserById } = require("../controllers/user.controller");


const userRouter = express.Router();

userRouter.route("/")
    .get([verifyJWT, verifyAdmin], getAllUsers);

userRouter.route("/:id")
    .get([verifyJWT, verifyAdminOrOwnUser], getUserById);

userRouter.route("/:id")
    .post([verifyJWT, verifyAdmin], updateUserById);


module.exports = userRouter;