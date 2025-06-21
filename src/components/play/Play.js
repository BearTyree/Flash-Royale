"use client";

import styles from "@/styles/play.module.css";
import Image from "next/image";
import EnergyMeter from "@/components/play/EnergyMeter";
import { Flashcard, Set } from "./logic";
import UserFlashcard from "@/components/play/UserFlashcard";
import { useState } from "react";

// let questionOne = new Flashcard("What's the color of the sky", "Blue", 1);
// let questionTwo = new Flashcard("What's Bear Tyree's real name", "Trinnean", 9);
// let questionThree = new Flashcard("Bleh", "bleh", 3);
// let questionFour = new Flashcard("Worst cave student", "alpin", 5);
// let questionFive = new Flashcard("caleb", "wang", 4);

// const questionArray = [
//   questionOne,
//   questionTwo,
//   questionThree,
//   questionFour,
//   questionFive,
// ];

// function displayRandomQuestion() {
//   let questionIndex = Math.floor(Math.random() * questionArray.length);
//   const questionText = document.querySelector(".question");
//   const pointText = document.querySelector(".question-value");
//   questionText.textContent = questionArray[questionIndex].term;
//   pointText.textContent = questionArray[questionIndex].value;
//   currentQuestion = questionArray[questionIndex];
// }

// function checkAnswer(question, user_answer) {
//   return question.definition == user_answer;
// }

// // const inputForm = document.querySelector("form");
// // const answerInput = document.querySelector(".input-container input");

// // const wrongAnswerText = document.querySelector(".wrongAnswer");

// function addPoints(value) {
//   console.log(value);
//   currentPoints += value;
//   if (currentPoints > 9) {
//     currentPoints = 9;
//   }
//   console.log(currentPoints);
// }

// function substractPoints(value) {
//   if (!((currentPoints -= value) < 0)) {
//     currentPoints -= value;
//   }
// }

// function renderPoints() {
//   for (const energy of energyMeter) {
//     if (!energy.classList.contains("invisible")) {
//       energy.classList.add("invisible");
//     }
//   }
//   for (let i = 0; i < currentPoints; i++) {
//     energyMeter[i].classList.remove("invisible");
//   }
// }

// function renderHealth() {
//   const healthText = document.querySelector(".health-text");
//   healthText.textContent = `${currentHealth}%`;
//   const health = document.querySelector(".health");
//   health.style.width = `${currentHealth}%`;
// }

// function incorrectAnswer() {}

// inputForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   if (checkAnswer(currentQuestion, answerInput.value)) {
//     addPoints(currentQuestion.value);
//     renderPoints();
//     inputForm.reset();
//     if (!wrongAnswerText.classList.contains("invisible"))
//       wrongAnswerText.classList.add("invisible");
//     displayRandomQuestion();
//   } else {
//     inputForm.reset();
//     wrongAnswerText.classList.remove("invisible");
//   }
// });

export default function Play({ flashcards }) {
  const [currentCard, setCurrentCard] = useState(flashcards[0]);

  return (
    <>
      <div className={styles.gameContent}>
        <div className={styles.opponentProfile}>
          <Image
            className={styles.userProfilePic}
            src={`/sample-profile.png`}
            alt={"Opponent's Profile Picture"}
            width={48}
            height={48}
          ></Image>
          <h3>Player 2</h3>
        </div>
        <div className={styles.userProfile}>
          <Image
            className={styles.userProfilePic}
            src={`/sample-profile.png`}
            alt={"Player's Profile Picture"}
            width={48}
            height={48}
          ></Image>
          <h3>Player 1</h3>
        </div>

        <div className={styles.playerContainer}>
          <UserFlashcard flashcard={currentCard} />
          <form action="#">
            <div className={styles.inputContainer}>
              <input type="text" id="answer" placeholder="answer" />
              <button type="submit">
                <Image
                  src={"/arrow-right-circle.svg"}
                  alt={"Submit Button"}
                  fill={true}
                  className={styles.submitButton}
                ></Image>
              </button>
            </div>
          </form>
          <p className={`${styles.wrongAnswer} ${styles.invisible}`}>
            Incorrect!
          </p>
          <EnergyMeter energy={0} />
        </div>
        <div className={styles.flashcardDeck}>
          <div className={styles.cardStack}>
            <div className={`${styles.card} ${styles.cardTop}`}>
              <h2>Flash Royale</h2>
            </div>
            <div className={`${styles.card} ${styles.cardBottom}`}></div>
          </div>
          <p>14 Cards Remaining</p>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.attack}>Attack</div>
          <div className={styles.defend}>Defend</div>
          <div className={styles.special}>Special</div>
        </div>

        <div className={styles.healthContainerOpponent}>
          <div className={styles.healthInfo}>
            <p className={styles.healthText}>100%</p>
            <div className={styles.healthBar}>
              <div className={styles.health}></div>
            </div>
          </div>
        </div>

        <div className={styles.healthContainerUser}>
          <div className={styles.healthInfo}>
            <p className={styles.healthText}>100%</p>
            <div className={styles.healthBar}>
              <div className={styles.health}></div>
            </div>
          </div>
        </div>

        <div className={styles.chatContainer}></div>
      </div>
    </>
  );
}
