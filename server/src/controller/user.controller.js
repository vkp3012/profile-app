import userModel from "../models/user.model.js";
import jsonWebtoken from "jsonwebtoken";
import responseHandler from "../handler/response.handler.js";

const signup = async(req,res) => {
    try {
        const { username,firstName,lastName,email,password } = req.body;
        //find user....
        const checkUser = await userModel.findOne({ username });
        //check user :- user all ready define
        if(checkUser){
            return responseHandler.badRequest(res,"username already used");
        };

        const user = new userModel();
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.setPassword(password);

        await user.save();

        const token = jsonWebtoken.sign(
            {data : user.id},
            process.env.TOKEN_SECRET,
            { expiresIn: "24h" }
        )

        responseHandler.created(res,{
            token,
            ...user._doc,
            id: user.id
        });

    } catch (error) {
        responseHandler.error(res);
    }
}

const login = async(req,res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({username}).select("username password salt id displayName");
        if(!user) return responseHandler.badRequest(res,"User not exist");
        if(!user.validPassword(password)) return responseHandler.badRequest(res,"Wrong Password");

        const token = jsonWebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn : "24h"}
        )

        user.password = undefined;
        user.salt = undefined;

        responseHandler.created(res,{
            token,
            ...user._doc,
            id : user.id
        });

    } catch (error) {
        responseHandler.error(res);
    }
}

export default {
    signup,
    login
};