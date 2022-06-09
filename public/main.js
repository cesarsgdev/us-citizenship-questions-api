const question = document.querySelector(".question p");
const answers = document.querySelector(".question ul");
const questionContainer = document.querySelector(".question");
const main = document.querySelector("main");
const score = document.querySelector("h2");
let currentScore = 0;
let questionsApp;
let questionsLength;
let currentIndex = 0;
getQuestions();

questionContainer.addEventListener("click", questionClick);
main.addEventListener("click", mainClick);

function getQuestions() {
  fetch("api/questions")
    .then((response) => response.json())
    .then((data) => {
      questionsApp = data;
      questionsLength = questionsApp.length;
      loadQuestion(currentIndex);
    });
}

async function questionClick(e) {
  const answers = document.querySelectorAll(".answer");
  if (e.target.classList.contains("answer")) {
    let answerResult;
    let correctAnswer;
    let answer = e.target.textContent;
    let answerID = this.getAttribute("question-id");
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      answer: answer,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    await fetch(`api/questions/${answerID}/checkAnswer`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.result) {
          answerResult = result.result;
          e.target.insertAdjacentHTML(
            "beforeend",
            '<i class="fa-solid fa-check"></i>'
          );
        } else {
          correctAnswer = result.correctAnswer;
        }
      })
      .catch((error) => console.log("error", error));
    if (answerResult) {
      currentScore++;
      score.textContent = `Score: ${currentScore}/${questionsLength}`;
      e.target.classList.add("correctAnswer");
      e.target.classList.remove("answerHover");
    } else {
      Array.from(answers).forEach((answer) => {
        if (answer.textContent === correctAnswer) {
          answer.classList.add("correctAnswer");
          answer.insertAdjacentHTML(
            "beforeend",
            '<i class="fa-solid fa-check"></i>'
          );
        }
        answer.classList.remove("answerHover");
      });

      e.target.classList.add("incorrectAnswer");
      e.target.insertAdjacentHTML(
        "beforeend",
        '<i class="fa-solid fa-xmark"></i>'
      );
    }

    questionContainer.removeEventListener("click", questionClick);
    const button = document.querySelector("button");
    button.classList.add("next");
    currentIndex++;
  }
}

function mainClick(e) {
  if (e.target.classList.contains("next")) {
    loadQuestion(currentIndex, true);
  }
}

function loadQuestion(index, next) {
  if (next) {
    questionContainer.addEventListener("click", questionClick);
    question.textContent = "";
    answers.innerHTML = "";
    questionContainer.firstChild.remove();
    main.lastChild.remove();
  }
  question.textContent = questionsApp[index].question;
  questionContainer.setAttribute("question-id", questionsApp[index]._id);
  questionsApp[index].answers.forEach((answer) => {
    const answerItem = document.createElement("li");
    answerItem.textContent = answer;
    answerItem.classList.add("answer", "answerHover");
    answers.appendChild(answerItem);
    score.textContent = `Score: ${currentScore}/${questionsLength}`;
  });
  questionContainer.insertAdjacentHTML(
    "afterbegin",
    `<span>Question ${index + 1}</span>`
  );
  main.insertAdjacentHTML("beforeend", `<button>Next Question</button>`);
}
