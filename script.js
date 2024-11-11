"use strict";

import dictionary from "./dictionary.json" with { type: "json" };

const set = new Set(dictionary);
const maxGuesses = 6;

let correctWord = ["", "", "", "", ""];
let guesses = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
let wordMap = new Map();
let guessField = 0;
let previousWord = "";
let streak = 0;
let completion = false;
let keyboardTracker = [["q", "none"], ["w", "none"], ["e", "none"], ["r", "none"], ["t", "none"], ["y", "none"], ["u", "none"], ["i", "none"], ["o", "none"], ["p", "none"], ["a", "none"], ["s", "none"], ["d", "none"], ["f", "none"], ["g", "none"], ["h", "none"], ["j", "none"], ["k", "none"], ["l", "none"], ["z", "none"], ["x", "none"], ["c", "none"], ["v", "none"], ["b", "none"], ["n", "none"], ["m", "none"]];

const guessElement = document.querySelector(".guesses");
for (let i = 1; i < (maxGuesses + 1); i++) {
  const row = document.createElement("div");
  row.setAttribute("id", "row" + i);
  guessElement.appendChild(row);
  for (let j = 1; j < 6; j++) {
    const div = document.createElement("div");
    const node = document.createTextNode("");
    div.appendChild(node);
    div.setAttribute("id", "letter" + String(i) + j);
    row.appendChild(div);
  }
}

const firstRowElement = document.getElementById("keyRow1");
const secondRowElement = document.getElementById("keyRow2");
const thirdRowElement = document.getElementById("keyRow3");
for(let i = 0; i < 10; i++) {
  const letter = document.createElement("button");
  const content = document.createTextNode(keyboardTracker[i][0].toUpperCase());
  letter.appendChild(content);
  letter.setAttribute("id", "keyboardLetter" + keyboardTracker[i][0]);
  letter.setAttribute("class", "keyboardLetter");
  firstRowElement.appendChild(letter);
}

for(let i = 10; i < 19; i++) {
  const letter = document.createElement("button");
  const content = document.createTextNode(keyboardTracker[i][0].toUpperCase());
  letter.appendChild(content);
  letter.setAttribute("id", "keyboardLetter" + keyboardTracker[i][0]);
  letter.setAttribute("class", "keyboardLetter");
  secondRowElement.appendChild(letter);
}

const enter = document.createElement("button");
const textEnter = document.createTextNode("ENTER");
enter.appendChild(textEnter);
enter.setAttribute("id", "keyboardEnter");
enter.setAttribute("class", "keyboardLetter");
thirdRowElement.appendChild(enter);

for(let i = 19; i < 26; i++) {
  const letter = document.createElement("button");
  const content = document.createTextNode(keyboardTracker[i][0].toUpperCase());
  letter.appendChild(content);
  letter.setAttribute("id", "keyboardLetter" + keyboardTracker[i][0]);
  letter.setAttribute("class", "keyboardLetter");
  thirdRowElement.appendChild(letter);
}

const keyboardDelete = document.createElement("button");
const textDelete = document.createTextNode("DEL");
keyboardDelete.appendChild(textDelete);
keyboardDelete.setAttribute("id", "keyboardDelete");
keyboardDelete.setAttribute("class", "keyboardLetter");
thirdRowElement.appendChild(keyboardDelete);

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

const animateKeyboard = function(element) {
  const animatedElement = document.getElementById(element);
  animatedElement.animate([
    {
      filter: "brightness(1)",
    },
    {
      transform: "translateY(4px)",
      filter: "brightness(1.25)",
    }
  ], {
    duration: 150,
    fill: "backwards",
  })
}

const checkDictionary = function () {
  let word = "";

  for (let i = 0; i < 5; i++) {
    word += guesses[guessField][i];
  }

  return set.has(word);
};

const generateWord = function () {
  let i = Math.floor(Math.random() * (Math.floor((dictionary.length + 1)) - Math.ceil(0)) + Math.ceil(0));
  correctWord = dictionary[i];
  while (correctWord === previousWord) {
    i = Math.floor(Math.random() * (Math.floor((dictionary.length + 1)) - Math.ceil(0)) + Math.ceil(0));
    correctWord = dictionary[i];
  }

  makeMap();

  return;
};

const makeMap = function () {
  wordMap.clear();

  let count;
  for(let i = 0; i < 5; i++) {
    count = wordMap.get(correctWord[i]) || 0;
    count++;
    wordMap.set(correctWord[i], count);
  }

  return;
};

const reduceCount = function (letter) {
  if (wordMap.has(letter)) {
    let result = wordMap.get(letter);
    result--;
    if (result <= 0) {
      wordMap.delete(letter);
    } else {
      wordMap.set(letter, result);
    }
  }

  return;
};

const checkLoss = function () {
  if(guessField >= maxGuesses) {
    lose();
  }

  return;
};

const switchColor = function (colorTracker) {
  for(let i = 0; i < 5; i++) {
    const element = document.getElementById("letter" + String((guessField + 1)) + (i + 1));
    switch(colorTracker[i]) {
      case "green":
        element.classList.toggle("correctPosition");
        break;
      case "yellow":
        element.classList.toggle("incorrectPosition");
        break;
      case "grey":
        element.classList.toggle("wrongLetter");
        break;
      default:
        throw new Error("Somehow you guessed an invalid word");
        break;
    }
  }
  return;
};

const checkGuess = function () {
  animateKeyboard("keyboardEnter");

  if (guesses[guessField][4] === "" || !checkDictionary()) {
    displayMessage("Invalid word");
    return;
  }

  let tracker = ["none", "none", "none", "none", "none"];

  for (let i = 0; i < 5; i++) {
    if (guesses[guessField][i] === correctWord[i]) {
      tracker[i] = "green";
      updateKeyboard(guesses[guessField][i], "green")
      reduceCount(guesses[guessField][i]);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (wordMap.has(guesses[guessField][i]) && tracker[i] !== "green") {
      tracker[i] = "yellow"
      updateKeyboard(guesses[guessField][i], "yellow")
      reduceCount(guesses[guessField][i]);
    } else if (tracker[i] === "none") {
      tracker[i] = "grey";
      updateKeyboard(guesses[guessField][i], "grey")
    }
  }

  switchColor(tracker);

  let allGreen = true;
  let i = 0;

  while(allGreen && i < 5) {
    if(tracker[i] !== "green") {
      allGreen = false;
    }
    i++;
  }

  displayMessage("Welcome to wordle (but not really)");

  if (allGreen) {
    win();
  } else {
    guessField++;
    checkLoss();
  }

  makeMap();

  return;
};

const addLetter = function (letter) {
  animateKeyboard("keyboardLetter" + letter.toLowerCase());
  
  let i = 0;

  while (guesses[guessField][i] !== "" && i < 5) {
    i++;
  }

  if (i === 5) {
    displayMessage("Your word is full");
    return;
  }

  guesses[guessField][i] = letter.toLowerCase();
  document.getElementById("letter" + String((guessField + 1)) + (i + 1)).textContent = letter.toUpperCase();

  return;
};

const deleteLetter = function () {
  animateKeyboard("keyboardDelete");

  if (guesses[guessField][0] === "") {
    return;
  }

  let i = 0;

  while (guesses[guessField][i + 1] !== "" && i < 4) {
    i++;
  }

  guesses[guessField][i] = "";
  document.getElementById("letter" + String((guessField + 1)) + (i + 1)).textContent = "";

  displayMessage("Welcome to wordle (but not really)");

  return;
};

const win = function () {
  displayMessage("You won!");
  completion = true;
  streak++;
  document.getElementById("streakLength").textContent = streak;

  return;
};

const lose = function () {
  let word = "";
  for (let i = 0; i < 5; i++) {
    word += correctWord[i];
  }
  displayMessage(`You lost, the word was: ${word.toUpperCase()}`);
  completion = true
  streak = 0;
  document.getElementById("streakLength").textContent = streak;

  return;
};

const updateKeyboard = function(letter, color) {
  let letterIndex = 0;

  while(letter !== keyboardTracker[letterIndex][0]) {
    letterIndex++;
  }

  switch(color) {
    case "green":
      keyboardTracker[letterIndex][1] = color;

      if(!document.getElementById("keyboardLetter" + letter).classList.contains("keyboardCorrectPosition")) {
        document.getElementById("keyboardLetter" + letter).classList.remove(...document.getElementById("keyboardLetter" + letter).classList);
        document.getElementById("keyboardLetter" + letter).classList.toggle("keyboardLetter");
        document.getElementById("keyboardLetter" + letter).classList.toggle("keyboardCorrectPosition");
      }

      break;
    case "yellow":
      if(keyboardTracker[letterIndex][1] !== "green") {
        keyboardTracker[letterIndex][1] = color;

        if(!document.getElementById("keyboardLetter" + letter).classList.contains("keyboardIncorrectPosition")) {
          document.getElementById("keyboardLetter" + letter).classList.remove(...document.getElementById("keyboardLetter" + letter).classList);
          document.getElementById("keyboardLetter" + letter).classList.toggle("keyboardLetter");
          document.getElementById("keyboardLetter" + letter).classList.toggle("keyboardIncorrectPosition");
        }
      }
      
      break;
    case "grey":
      if(keyboardTracker[letterIndex][1] !== "green" && keyboardTracker[letterIndex][1] !== "yellow") {
        keyboardTracker[letterIndex][1] = color;

        if(!document.getElementById("keyboardLetter" + letter).classList.contains("keyboardWrongLetter")) {
          document.getElementById("keyboardLetter" + letter).classList.toggle("keyboardWrongLetter");
        }
      }

      break;
    default:
      throw new Error("Invalid color code");
      break;
  }

  return;
} 

generateWord();

document.body.addEventListener("keyup", (ev) => {
  if (completion) {
    displayMessage("This round is over, generate a new word to keep playing");
    return;
  }

  if (ev.code === `Key${ev.key.toUpperCase()}`) {
    addLetter(ev.key);
  } else if (ev.key === "Enter") {
    checkGuess();
  } else if (ev.key === "Backspace") {
    deleteLetter();
  }
});

document.querySelector(".reset").addEventListener("click", function() {
  for (let i = 0; i < maxGuesses; i++) {
    for (let j = 0; j < 5; j++) {
      const element = document.getElementById("letter" + String((i + 1)) + (j + 1));

      element.textContent = "";

      if(element.classList.contains("correctPosition")) {
        element.classList.toggle("correctPosition");
      } else if (element.classList.contains("incorrectPosition")) {
        element.classList.toggle("incorrectPosition");
      } else if (element.classList.contains("wrongLetter")) {
        element.classList.toggle("wrongLetter");
      }
    }
  }

  for(let i = 0; i < 26; i++) {
    if(document.getElementById("keyboardLetter" + keyboardTracker[i][0]).classList.contains("keyboardCorrectPosition")) {
      document.getElementById("keyboardLetter" + keyboardTracker[i][0]).classList.toggle("keyboardCorrectPosition");
    } else if (document.getElementById("keyboardLetter" + keyboardTracker[i][0]).classList.contains("keyboardIncorrectPosition")) {
      document.getElementById("keyboardLetter" + keyboardTracker[i][0]).classList.toggle("keyboardIncorrectPosition");
    } else if (document.getElementById("keyboardLetter" + keyboardTracker[i][0]).classList.contains("keyboardWrongLetter")) {
      document.getElementById("keyboardLetter" + keyboardTracker[i][0]).classList.toggle("keyboardWrongLetter")
    }
    
    keyboardTracker[i][1] = "none";
  }

  guesses = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  guessField = 0;
  completion = false;
  generateWord();
  displayMessage('Welcome to Wordle (but not really)');
  document.querySelector(".resetButton").blur();
})

document.getElementById("keyboardEnter").addEventListener("click", function() {
  if (completion) {
    displayMessage("This round is over, generate a new word to keep playing");
    return;
  }

  checkGuess();
})

document.getElementById("keyboardDelete").addEventListener("click", function() {
  if (completion) {
    displayMessage("This round is over, generate a new word to keep playing");
    return;
  }

  deleteLetter();
})

document.querySelectorAll(".keyboardLetter").forEach(element => {
  element.addEventListener("click", function() {
    if (completion) {
      displayMessage("This round is over, generate a new word to keep playing");
      return;
    }

    addLetter(element.textContent);
  })
});