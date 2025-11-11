import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, bio } = req.body;

    if(!name || !email || !password || !role){
      return res.status(400).json({ message: "Name, Email, Password and Role are required" });
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      phone,
      bio
    });

    await newUser.save();

    return res.json({
      status: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if(!user){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if(!isPasswordValid){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "1234567890",
      { expiresIn: "1d" }
    );

    return res.json({
      status: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET PROFILE
export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if(!user) return res.status(404).json({ message: "User not found" });

    res.json({
      status: "Profile fetched successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGOUT (Frontend just removes token)
export const logoutUser = async (req, res) => {
  // If you're storing token in frontend localStorage:
  return res.json({ status: "Logged out successfully. Just remove token on frontend." });

  // If using cookie tokens, you would do:
  // res.clearCookie("token");
  // res.json({ status: "Logged out successfully" });
};
