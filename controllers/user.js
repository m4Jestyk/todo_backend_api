import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import errorHandler from "../middlewares/error.js";

export const getAllUsers = async (req, res) => {};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return next(new errorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendCookie(res, user, "User created", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (token) {
      return next(new errorHandler("A user already logged in", 400));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new Error("User not found :/"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new errorHandler("Invalid Password", 404));
    }

    sendCookie(res, user, `Welcome ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = async (req, res) => {
  await res.cookie("token", "", { expires: new Date(Date.now()) });

  await res.status(200).json({
    success: true,
    user: req.user,
    message: "Logged out",
  });
};
