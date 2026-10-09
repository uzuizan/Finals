const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/Students");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch {
    res.status(500).json({ message: "Unable to load students" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, course, age } = req.body;
    if (!name || !course || !Number.isInteger(Number(age)) || Number(age) < 1) {
      return res.status(400).json({ message: "Valid name, course, and age are required" });
    }
    const student = new Student({ name: String(name).trim(), course: String(course).trim(), age: Number(age) });
    await student.save();
    res.status(201).json(student);
  } catch {
    res.status(500).json({ message: "Unable to add student" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const { name, course, age } = req.body;
    if (!name || !course || !Number.isInteger(Number(age)) || Number(age) < 1) {
      return res.status(400).json({ message: "Valid name, course, and age are required" });
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name: String(name).trim(), course: String(course).trim(), age: Number(age) },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch {
    res.status(500).json({ message: "Unable to update student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch {
    res.status(500).json({ message: "Unable to delete student" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
