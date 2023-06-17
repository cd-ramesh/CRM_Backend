const { default: mongoose } = require("mongoose");
const { userType, userStatus } = require("../constants");


const userSchema = new mongoose.Schema({
    name: {type: String, require: true},
    userId: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    userType: {type: String, default: userType.customer},
    userStatus: {type: String, default: userStatus.approved}
},{
    timestamps: true
})

const User = mongoose.model("User",userSchema);

module.exports = User;