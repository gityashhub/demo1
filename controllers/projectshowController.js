import ProjectShowcase from "../models/ProjectShowcase.js";


export const createProjectShowcase = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can create project showcases." });
    }
    const showcase = await ProjectShowcase.create({
        freelancerId: req.user._id,
        title: req.body.title,
        description: req.body.description,
        images: req.body.images,
        tags: req.body.tags
    });
    res.status(201).json(showcase);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

export const getProjectShowcases = async (req, res) => {
  try {
    const showcases = await ProjectShowcase.find({ freelancerId: req.params.freelancerId });
    res.json(showcases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProjectShowcase = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can update project showcases." });
    }
    const showcase = await ProjectShowcase.findOneAndUpdate(
        { _id: req.params.id, freelancerId: req.user._id },
        {
            title: req.body.title,
            description: req.body.description,
            images: req.body.images,
            tags: req.body.tags
        }, 
        { new: true }
    );;
    if (!showcase) {
        return res.status(404).json({ message: "Project showcase not found." });
    }   
    res.json(showcase);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
}

export const deleteProjectShowcase = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
        return res.status(403).json({ message: "Only freelancers can delete project showcases." });
    }

    const showcase = await ProjectShowcase.findOneAndDelete({
        _id: req.params.id,
        freelancerId: req.user._id
    });
    if (!showcase) {
        return res.status(404).json({ message: "Project showcase not found." });
    }
    res.json({ message: "Project showcase deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

