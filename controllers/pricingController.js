import PricingPackage from "../models/PricingPackage.js"; 

export const createPricingPackage = async (req, res) => {
    try {
        if (req.user.role !== "freelancer") {
            return res.status(403).json({ message: "Only freelancers can create pricing packages." });
        }
        const existingPackage = await PricingPackage.findOne({ freelancerId: req.user._id, title: req.body.title });
        if (existingPackage) {
            return res.status(400).json({ message: "A pricing package with this title already exists." });
        }
        const pricingPackage = new PricingPackage({
            freelancerId: req.user._id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            deliveryDays: req.body.deliveryDays
        });
        await pricingPackage.save();
        res.status(201).json(pricingPackage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPricingPackages = async (req, res) => {
    try {
        const packages = await PricingPackage.find({ freelancerId: req.params.freelancerId })
         .populate("freelancerId", "name");
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updatePricingPackage = async (req, res) => {
    try {
        const pricingPackage = await PricingPackage.findById(req.params.id);
        if (!pricingPackage) {
            return res.status(404).json({ message: "Pricing package not found." });
        }
        if (pricingPackage.freelancerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this pricing package." });
        }
        
        const updatePricing = await PricingPackage.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                deliveryDays: req.body.deliveryDays
            },
            { new: true }
        );
        res.json(updatePricing);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
};

export const deletePricingPackage = async (req, res) => {
    try {
        const pricingPackage = await PricingPackage.findById(req.params.id);
        if (!pricingPackage) {
            return res.status(404).json({ message: "Pricing package not found." });
        }
        if (pricingPackage.freelancerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this pricing package." });
        }
        await PricingPackage.findByIdAndDelete(req.params.id);
        res.json({ message: "Pricing package deleted successfully." });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};