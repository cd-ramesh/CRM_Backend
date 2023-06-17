const express = require("express");

const { verifyJWT, verifyAdmin, verifyAdminOrOwnUser } = require("../middlewares/user.middleware");
const { getAllUsers, getUserById, updateUserById } = require("../controllers/user.controller");


const userRouter = express.Router();

userRouter.route("/",[verifyJWT, verifyAdmin])
    .get(getAllUsers);

userRouter.route("/:id",[verifyJWT, verifyAdminOrOwnUser])
    .get(getUserById);

userRouter.route("/:id",[verifyJWT, verifyAdmin])
    .post(updateUserById);


module.exports = userRouter;