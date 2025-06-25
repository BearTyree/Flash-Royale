"use client";

import styles from "@/styles/play.module.css";
import Image from "next/image";
import EnergyMeter from "@/components/play/EnergyMeter";
import { Flashcard, Set } from "./logic";
import UserFlashcard from "@/components/play/UserFlashcard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Play({ flashcards, ws, me, opponent }) {
  const router = useRouter();

  const [currentCard, setCurrentCard] = useState(flashcards[0]);
  const [health, setHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [xp, setXp] = useState(0);
  const [answer, setAnswer] = useState("");
  const [numCorrect, setNumCorrect] = useState(0);

  useEffect(() => {
    ws.addEventListener("message", (message) => {
      const { event } = JSON.parse(message.data);

      switch (event) {
        case "healths": {
          const { one, two } = JSON.parse(message.data);
          if (one[0] == me) {
            setHealth(one[1]);
          } else {
            setOpponentHealth(one[1]);
          }
          if (two[0] == me) {
            setHealth(two[1]);
          } else {
            setOpponentHealth(two[1]);
          }
          break;
        }
        case "xps": {
          const { one, two } = JSON.parse(message.data);
          if (one[0] == me) {
            setXp(one[1]);
          }
          if (two[0] == me) {
            setXp(two[1]);
          }
          break;
        }
        case "end": {
          const { one, two } = JSON.parse(message.data);
          if (one[0] == me) {
            if (one[1] == "win") {
              router.push(`/win`);
            } else {
              router.push(`/lose`);
            }
          }
          if (two[0] == me) {
            if (two[1] == "win") {
              router.push(`/win`);
            } else {
              router.push(`/lose`);
            }
          }
          break;
        }
      }
    });
  }, [ws, me, router]);

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
          <h3>{opponent}</h3>
        </div>
        <div className={styles.userProfile}>
          <Image
            className={styles.userProfilePic}
            src={`/sample-profile.png`}
            alt={"Player's Profile Picture"}
            width={48}
            height={48}
          ></Image>
          <h3>{me}</h3>
        </div>

        <div className={styles.playerContainer}>
          <UserFlashcard flashcard={currentCard} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (answer == currentCard.definition) {
                ws.send(JSON.stringify({ event: "correct" }));
                setCurrentCard(
                  flashcards[(numCorrect + 1) % flashcards.length]
                );
                setNumCorrect((p) => p + 1);
                setAnswer("");
              }
              setAnswer("");
            }}
          >
            <div className={styles.inputContainer}>
              <input
                type="text"
                id="answer"
                placeholder="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
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
          <EnergyMeter energy={xp} />
        </div>
        <div className={styles.flashcardDeck}>
          <div className={styles.cardStack}>
            <div className={`${styles.card} ${styles.cardTop}`}>
              <h2>Flash Royale</h2>
            </div>
            <div className={`${styles.card} ${styles.cardBottom}`}></div>
          </div>
        </div>
        <div className={styles.actionContainer}>
          <div
            onClick={() => ws.send(JSON.stringify({ event: "attack" }))}
            className={styles.attack}
          >
            Attack
          </div>
          <div
            onClick={() => ws.send(JSON.stringify({ event: "heal" }))}
            className={styles.defend}
          >
            Heal
          </div>
          <div className={styles.special}>Skip</div>
        </div>

        <div className={styles.healthContainerOpponent}>
          <div className={styles.healthInfo}>
            <p className={styles.healthText}>{opponentHealth}%</p>
            <div className={styles.healthBar}>
              <div className={styles.health}></div>
            </div>
          </div>
        </div>

        <div className={styles.healthContainerUser}>
          <div className={styles.healthInfo}>
            <p className={styles.healthText}>{health}%</p>
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
