import express from "express";
import {
  registerUser,
  loginUser,
  getLoggedInUser,
  logoutUser,
  googleLogin,
  setPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getLoggedInUser);
router.post("/logout", logoutUser);
router.get("/google", googleLogin);
router.post("/set-password", setPassword);

export default router;
