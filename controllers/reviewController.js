// controllers/reviewController.js
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Fetch booking to validate access & status
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the client can review
    if (booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to review this booking." });
    }

    // Only allow review if job is completed
    if (booking.status !== "completed" && booking.status !== "paid") {
      return res.status(400).json({ message: "Review allowed only after work is completed." });
    }

    const review = await Review.create({
      bookingId,
      clientId: req.user._id,
      freelancerId: booking.freelancerId,
      rating,
      comment
    });

    res.status(201).json(review);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getFreelancerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ freelancerId: req.params.freelancerId })
      .populate("clientId", "name avatar") // optional
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
