import FreelancerProfile from "../models/FreelancerProfile.js";

export const createFreelancerProfile = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can create a profile." });
    }

    const exists = await FreelancerProfile.findOne({ userId: req.user._id });
    if (exists) return res.status(400).json({ message: "Profile already exists." });

    const profile = await FreelancerProfile.create({
      userId: req.user._id,
      specialization: req.body.specialization,
      skills: req.body.skills,
      experience: req.body.experience,
      description: req.body.description
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getFreelancerProfile = async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOne({ userId: req.params.userId })
      .populate("userId", "name");

    if (!profile) return res.status(404).json({ message: "Freelancer profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
};


export const updateFreelancerProfile = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can update profile." });
    }

    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found." });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteFreelancerProfile = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can delete profile." });
    }
    const profile = await FreelancerProfile.findOneAndDelete({ userId: req.user._id });

    if (!profile) return res.status(404).json({ message: "Profile not found." });   
    res.json({ message: "Profile deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};