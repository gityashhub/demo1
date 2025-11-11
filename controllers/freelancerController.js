import User from "../models/Users.js";
import FreelancerProfile from "../models/FreelancerProfile.js";
import Review from "../models/Review.js";

export const getAllFreelancers = async (req, res) => {
  try {
    const { search, skills, minExperience, maxExperience, specialization, minRating, maxRating } = req.query;
    
    let query = {};
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }
    
    if (minExperience || maxExperience) {
      query.experience = {};
      if (minExperience) query.experience.$gte = parseInt(minExperience);
      if (maxExperience) query.experience.$lte = parseInt(maxExperience);
    }
    
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    
    let freelancers = await FreelancerProfile.find(query)
      .populate("userId", "name email avatar bio")
      .lean();
    
    for (let freelancer of freelancers) {
      const reviews = await Review.find({ freelancerId: freelancer.userId._id });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      freelancer.avgRating = parseFloat(avgRating.toFixed(1));
      freelancer.reviewCount = reviews.length;
    }
    
    if (minRating || maxRating) {
      freelancers = freelancers.filter(f => {
        const rating = f.avgRating;
        if (minRating && rating < parseFloat(minRating)) return false;
        if (maxRating && rating > parseFloat(maxRating)) return false;
        return true;
      });
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      freelancers = freelancers.filter(f => {
        const nameMatch = (f.userId?.name ?? "").toLowerCase().includes(searchLower);
        const specializationMatch = (f.specialization ?? "").toLowerCase().includes(searchLower);
        const descriptionMatch = (f.description ?? "").toLowerCase().includes(searchLower);
        const skillsMatch = f.skills && Array.isArray(f.skills) 
          ? f.skills.some(skill => (skill ?? "").toLowerCase().includes(searchLower))
          : false;
        
        return nameMatch || specializationMatch || descriptionMatch || skillsMatch;
      });
    }
    
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFreelancerDetails = async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOne({ userId: req.params.id })
      .populate("userId", "name email avatar bio phone");
    
    if (!profile) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    
    const reviews = await Review.find({ freelancerId: req.params.id })
      .populate("clientId", "name avatar")
      .sort({ createdAt: -1 });
    
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    res.json({
      profile,
      avgRating: avgRating.toFixed(1),
      reviewCount: reviews.length,
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
