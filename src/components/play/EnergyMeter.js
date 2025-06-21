import styles from "@/styles/energy-meter.module.css";

export default function EnergyMeter({ energy }) {
  return (
    <div className={`${styles.energyMeter}`}>
      <div
        className={`${styles.energyUnit1} ${energy < 1 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit2} ${energy < 2 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit3} ${energy < 3 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit4} ${energy < 4 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit5} ${energy < 5 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit6} ${energy < 6 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit7} ${energy < 7 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit8} ${energy < 8 && styles.invisible}`}
      ></div>
      <div
        className={`${styles.energyUnit9} ${energy < 9 && styles.invisible}`}
      ></div>
    </div>
  );
}
