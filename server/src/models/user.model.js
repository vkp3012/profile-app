import mongoose from "mongoose";
import modelOptions from "./model.options.js";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    username : {
        type:String,
        required : true,
        unique : true,
    },
    firstName : {
        type:String,
        require:true,
    },
    lastName : {
        type: String,
        required :true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type:String,
        required : true,
        select : false,
    },
    salt : {
        type: String,
        required: true,
        select: false
    }
},modelOptions);

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512",
    ).toString("hex");
}

UserSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512"
    ).toString("hex");
    return this.password === hash;
}

const UserModel = mongoose.model("User",UserSchema);
export default UserModel;