import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET);

const sendTokenResponse = (user, statusCode, res) => {
  const token = createToken(user._id);
  const { password, ...userDetails } = user._doc;
  res
    .cookie("access_token", token, { httpOnly: true })
    .status(statusCode)
    .json(userDetails);
};

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(errorHandler(401, "Wrong credentials!"));

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      sendTokenResponse(user, 200, res);
    } else {
      const temporaryPassword = `${Math.random()
        .toString(36)
        .slice(-8)}${Math.random().toString(36).slice(-8)}`;
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      const username = `${name.split(" ").join("").toLowerCase()}${Math.random()
        .toString(36)
        .slice(-4)}`;

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();

      sendTokenResponse(newUser, 200, res);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
