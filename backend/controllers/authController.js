import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// this function is for the crting the new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

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
    if (!user)
      return res
        .status(400)
        .json({ success: false, msg: "Invalid Credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, msg: "Wrong Password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    // ✅ Set JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in prod
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 12,
    });

    res.json({
      success: true,
      msg: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Server Error", error: err.message });
    console.log("Error in logging in: ", err.message);
  }
};
