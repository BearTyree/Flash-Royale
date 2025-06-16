"use client";
import styles from "@/styles/sets.module.css";

import Image from "next/image";
import Link from "next/link";

import { deleteSet } from "@/actions/cards";

import { useOptimistic } from "react";

export default function SetsList({ cardSets }) {
  const [optimisticCardSets, deleteOptimisticCardSet] = useOptimistic(
    cardSets,
    (state, id) => {
      return state.filter((cardSet) => cardSet.id != id);
    }
  );
  return (
    <>
      {optimisticCardSets.map((set) => (
        <div key={set.id} className={styles.setContainer}>
          <h2>{JSON.parse(set.cards).name}</h2>
          <h3>{JSON.parse(set.cards).length} terms</h3>
          <Image
            src="/star.svg"
            alt="star"
            width={24}
            height={24}
            // onClick={starSet}
            className={styles.starButton}
          ></Image>
          <div className={styles.options}>
            <Link href={`/sets/${set.id}`} className={styles.setButton}>
              Edit Set
            </Link>
            <div className={styles.setButton}>Use Set</div>
            <form
              action={async (formData) => {
                const id = formData.get("id");
                deleteOptimisticCardSet(id);
                await deleteSet(id);
              }}
            >
              <input type="hidden" name="id" value={set.id} />
              <button className={styles.deleteButton}>Delete Set</button>
            </form>
          </div>
        </div>
      ))}
    </>
  );
}
