import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utils/features.js";

export const getAllUsers = async (req, res)=>{

}


export const register = async(req, res)=>{
    const {name, email, password} = req.body;

    let user = await User.findOne({email});

    if(user){
        return res.status(404).json({
            success: false,
            message: "User already exists",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    sendCookie(res, user, "User created", 201);

}

export const login = async (req, res, next) => {

    const {token} = req.cookies;

    console.log("working1")

    if(token){
        await res.status(404).json({
            success: false,
            message: "User already logged in"
        })
    }

    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found :/",
        })
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(404).json({
            success: false,
            message: "Invalid password :/",
        })
    }

    sendCookie(res, user, `Welcome ${user.name}`, 200)
}

export const getUserDetails = async (req, res)=>{

    res.status(200).json({
        success: true,
        user: req.user,
    })
}

export const logout = async (req, res)=>{

    await res.cookie("token","", {expires: new Date(Date.now())})

    await res.status(200).json({
        success: true,
        user: req.user,
        message: "Logged out",
    })
}