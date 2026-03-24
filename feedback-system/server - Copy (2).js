const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/feedbackdb")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const FeedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true },
    comments: { type: String, required: true }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

// POST API
app.post("/feedback", async (req, res) => {
    const { name, email, rating, comments } = req.body;

    if (!name || !email || !rating || !comments) {
        return res.status(400).send({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).send({ message: "Rating must be between 1 and 5" });
    }

    const feedback = new Feedback({ name, email, rating, comments });

    await feedback.save();

    res.send({ message: "Feedback submitted successfully" });
});

// GET API
app.get("/feedbacks", async (req, res) => {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
});

// Server Start
app.listen(3000, () => {
    console.log("Server running on port 3000");
});