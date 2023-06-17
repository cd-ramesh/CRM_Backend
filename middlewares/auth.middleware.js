const User = require("../models/user.model");


const verifyRegister = async (req, res, next)=>{
    if(!req.body.name) 
        res.status(400).send({message: "Please provide Name."});
    if(!req.body.userId) 
        res.status(400).send({message: "Please provide User ID."});
    if(!req.body.email) 
        res.status(400).send({message: "Please provide Email."});
    if(!req.body.password) 
        res.status(400).send({message: "Please provide password."});

    const userById = await User.findOne({userId: req.body.userId});
    if(userById)
        res.status(400).send({message: "User ID already exists."});
    
    const userByEmail = await User.findOne({email: req.body.email});
    if(userByEmail)
        res.status(400).send({message: "Email ID already exists."});

    const password = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if(!(req.body.password.match(password)))
        res.status(400).send({message: "Password must meet the following criteria: - Contain at least one digit (0-9) - Contain at least one special character (!@#$%^&*) - Be 8 to 16 characters long"});
    
    next();
}

module.exports = verifyRegister;