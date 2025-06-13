import styles from "@/styles/menu.module.css";
import Header from "@/components/Header";

export default function Menu() {
  return (
    <>
      <Header />
      <div id={styles.menuContent}>
        <h1>Flash Royale</h1>
        <div className={styles.roomsContainer}>
          <div className={styles.roomsHeading}>
            <h2>Rooms</h2>
            <p>find a room</p>
          </div>
          <div className={styles.roomsList}></div>

          <button>Create Room</button>
        </div>
      </div>
    </>
  );
}
