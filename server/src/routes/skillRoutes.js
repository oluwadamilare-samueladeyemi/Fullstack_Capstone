import express from "express";
import mongoose from "mongoose";
import Skill from "../models/Skill.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;

    const skills = await Skill.find(filter).sort({ _id: 1 });
    res.status(200).json(skills);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json(skill);
  } catch (err) {
    next(err);
  }
});


export default router;
// // Create a new skill
// router.post('/api/skills', async (req, res) => {
//   try {
//     const skill = new Skill(req.body);
//     await skill.save();
//     res.status(201).json(skill);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
