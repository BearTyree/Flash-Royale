"use client";

import styles from "@/styles/sets.module.css";
import Image from "next/image";

export default function Sets() {
  function starSet() {}

  function useSet() {}

  return (
    <>
      <div className={styles.setViewerHeader}>
        <h1>View Your Sets</h1>
        <form action="">
          <input
            type="text"
            placeholder="search sets"
            className={styles.setSearch}
          />
        </form>
      </div>

      <div className={styles.setViewerContainer}>
        <div className={styles.setContainer}>
          <h2>Bear Trivia</h2>
          <h3>36 terms</h3>
          <Image
            src="/star.svg"
            alt="star"
            width={24}
            height={24}
            onClick={starSet}
            className={styles.starButton}
          ></Image>
          <div onClick={useSet} className={styles.useSetButton}>
            Use Set
          </div>
        </div>
      </div>
    </>
  );
}
