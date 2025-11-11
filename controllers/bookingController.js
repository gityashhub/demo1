import Booking from "../models/Booking.js";
import PricingPackage from "../models/PricingPackage.js";
import router from "../routes/pricingRoutes.js";

export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can create bookings." });
    }

    const booking = await Booking.create({
      clientId: req.user._id,
      freelancerId: req.body.freelancerId,
      pricingPackageId: req.body.pricingPackageId,
      title: req.body.title,
      brief: req.body.brief
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const filter = req.user.role === "client"
      ? { clientId: req.user._id }
      : { freelancerId: req.user._id };

    const bookings = await Booking.find(filter)
      .populate("clientId", "name phone avatar")
      .populate("freelancerId", "name phone avatar")
      .populate("pricingPackageId", "title price");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("clientId", "name phone avatar")
      .populate("freelancerId", "name phone avatar")
      .populate("pricingPackageId", "title price");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Access control: only involved users can view
    if (
      booking.clientId._id.toString() !== req.user._id.toString() &&
      booking.freelancerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "accepted";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const startWork = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "in-progress";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitWork = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "submitted";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveWork = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "completed";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "paid";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the client or the assigned freelancer can cancel
    const isClient = booking.clientId.toString() === req.user._id.toString();
    const isFreelancer = booking.freelancerId.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: "Not authorized to cancel this booking." });
    }

    // Cancel only before freelancer accepts
    if (booking.status !== "requested") {
      return res.status(400).json({ message: "Cannot cancel after acceptance." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default router;

