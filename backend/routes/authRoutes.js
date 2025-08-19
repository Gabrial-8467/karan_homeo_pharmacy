// routes/authRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get user profile
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({ data: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // Assuming bcrypt in model pre-save
    }

    const updatedUser = await user.save();

    res.json({
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
