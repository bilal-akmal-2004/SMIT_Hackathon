import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";

// this function is for the crting the new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    //  Detect account without a password

    if (exists) {
      if (!exists.password) {
        return res.status(200).json({
          success: false,
          code: "PASSWORD_NOT_SET",
          msg: "Password not set for this account.",
        });
        return res
          .status(400)
          .json({ success: false, msg: "User already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    // ✅ Set JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 12,
    });

    res
      .status(201)
      .json({ success: true, msg: "User registered successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Server Error", error: err.message });

    console.log("Error in registering new user: ", err.message);
  }
};

// this function is for when the user is logging in
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid Credentials." });
    }

    //  Detect account without a password
    if (!user.password) {
      return res.status(200).json({
        success: false,
        code: "PASSWORD_NOT_SET",
        msg: "Password not set for this account.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Wrong Password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 12,
    });

    res.json({
      success: true,
      msg: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("Error in logging in: ", err.message);
    res
      .status(500)
      .json({ success: false, msg: "Server Error", error: err.message });
  }
};

// this function is check if the user's jwt token is created succesfuklly then he can enter the app
export const getLoggedInUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.json({ user });
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token." });
  }
};

// this for the logout on the frontedn beacsue we can't clear cookies on the frontedn
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.json({ success: true, msg: "Logged out successfully" });
};

//this function is for the google login and stuff
export const googleLogin = async (req, res) => {
  const code = req.query.code;
  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    console.log("Goggle response: ", googleRes);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name } = userRes.data;
    // console.log(userRes);
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",

        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 12 * 60 * 60 * 1000, // 12h
      })
      .status(200)
      .json({
        message: "success",
        user,
      });
  } catch (err) {
    console.log("error in googleLogin: ", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// to set the password if not in the db
export const setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    if (user.password) {
      return res
        .status(400)
        .json({ success: false, msg: "Password already set" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      msg: "Password set successfully. Please log in again.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Server Error", error: err.message });
  }
};
