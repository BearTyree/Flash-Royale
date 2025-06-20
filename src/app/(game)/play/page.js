import styles from "@/styles/play.module.css";
import Image from "next/image";

export default function Play() {
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
          <div className={styles.flashcard}>
            <p className={styles.questionValue}></p>
            <p className={styles.question}></p>
          </div>
          <form action="#">
            <div className={styles.inputContainer}>
              <input type="text" id="answer" placeholder="answer" />
              <button type="submit">
                <Image src={"/arrow-right-circle.svg"} alt={'Submit Button'} fill={true} className={styles.submitButton}>
                </Image>
              </button>
            </div>
          </form>
          <p className={`${styles.wrongAnswer} ${styles.invisible}`}>Incorrect!</p>
          <div className={`${styles.energyMeter}`}>
            <div className={`${styles.energyUnit} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit2} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit3} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit4} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit5} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit6} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit7} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit8} ${styles.invisible}`}></div>
            <div className={`${styles.energyUnit9} ${styles.invisible}`}></div>
          </div>
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
