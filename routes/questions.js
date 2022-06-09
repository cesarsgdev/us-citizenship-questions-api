const express = require("express");
const router = express.Router();
const Question = require("../models/questions");

// Endpoint to get a list of all questions

router.get("/", async (req, res) => {
  try {
    // const questions = await Question.find(
    //   { $sample: { size: 5 } },
    //   { __v: 0, answer: 0 }
    // ).limit();
    const questions = await Question.aggregate([
      {
        $project: { __v: 0, answer: 0 },
      },
    ]).sample(94);
    questions.forEach((question) => {
      for (var i = question.answers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = question.answers[i];
        question.answers[i] = question.answers[j];
        question.answers[j] = temp;
      }
    });
    res.status(200).json(questions);
  } catch (e) {
    res.status(400).json({ status: "error", message: `${e.message}` });
  }
});

// Endpoint to get a specific question or a random question if the param 'random' is specified => GET /api/questions/:id || api/questions/random

router.get("/:id", async (req, res) => {
  if (req.params.id === "random") {
    const random = Math.floor(Math.random() * 50);
    try {
      const question = await Question.find({}, { __v: 0 });
      res.status(200).json({ status: "success", data: question[random] });
    } catch (e) {}
  } else {
    res.status(200).json({
      message: `This is the endpoint to get a specific question with id ${req.params.id}...`,
    });
  }
});

// Endpoint to check if a submitted answer is correct => POST /api/questions/:id/checkAnswer

router.post("/:id/checkAnswer", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (req.body.answer === question.answer) {
      res.status(200).json({ status: "success", result: true });
    } else {
      res.status(200).json({
        status: "success",
        result: false,
        correctAnswer: question.answer,
      });
    }
  } catch (e) {
    res.status(400).json({ status: "error", message: `${e.message}` });
  }
});

// Endpoint to create a question => POST /api/questions

router.post("/", async (req, res) => {
  try {
    const question = await new Question(req.body);
    await question.save();
    res.status(200).json(question);
  } catch (e) {
    res.status(400).json({ status: "error", message: `${e.message}` });
  }
});

module.exports = router;
