const express = require("express");
const TeamMember = require("../models/TeamMember");

const router = express.Router();

// GET all team members
router.get("/", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single team member by ID
router.get("/:id", async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new team member
router.post("/", async (req, res) => {
  const { name, position, bio, image, email, phone, experience, expertise } =
    req.body;

  if (!name || !position) {
    return res
      .status(400)
      .json({ message: "Name and position are required" });
  }

  const newTeamMember = new TeamMember({
    name,
    position,
    bio,
    image,
    email,
    phone,
    experience,
    expertise: expertise || [],
  });

  try {
    const saved = await newTeamMember.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update team member
router.put("/:id", async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    const { name, position, bio, image, email, phone, experience, expertise } =
      req.body;

    if (name) teamMember.name = name;
    if (position) teamMember.position = position;
    if (bio !== undefined) teamMember.bio = bio;
    if (image !== undefined) teamMember.image = image;
    if (email !== undefined) teamMember.email = email;
    if (phone !== undefined) teamMember.phone = phone;
    if (experience !== undefined) teamMember.experience = experience;
    if (expertise !== undefined) teamMember.expertise = expertise;

    const updated = await teamMember.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE team member
router.delete("/:id", async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
