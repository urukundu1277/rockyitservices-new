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
  const { name, position, email, phone, image } = req.body;

  if (!name || !position || !email || !phone) {
    return res
      .status(400)
      .json({ message: "Name, position, email, and phone are required" });
  }

  const newTeamMember = new TeamMember({
    name,
    position,
    email,
    phone,
    image: image || null,
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

    const { name, position, email, phone, image } = req.body;

    if (name) teamMember.name = name;
    if (position) teamMember.position = position;
    if (email) teamMember.email = email;
    if (phone) teamMember.phone = phone;
    if (image !== undefined) teamMember.image = image;

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
