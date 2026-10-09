const mongoose = require("mongoose");


const studentsSchema = new mongoose.Schema({
    name: String,
    course: String,
    age: Number
});

module.exports = mongoose.model("Student", studentsSchema);
