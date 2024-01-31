import { User } from "../models/user.js";
import jwt from "jsonwebtoken"; 

export const isAuthenticated = async (req, res, next) => {

    const {token} = req.cookies;
    console.log(token)

    if(!token){
        res.status(404).json({
            success: false,
            message: "You're not logged in"
        }) 
    }

    const decoded = await jwt.verify(token, process.env.JWT_KEY)

    req.user = await User.findById(decoded._id);

    next();
}