import styles from "@/styles/sets.module.css";
import Image from "next/image";

import { getDbAsync } from "@/lib/prisma.js";
import { authenticated } from "@/controllers/auth.js";

export default async function Sets() {
  function starSet() {}

  function useSet() {}

  const prisma = await getDbAsync();
  const username = await authenticated();

  if (!username) {
    return <div>Error</div>;
  }

  const user = await prisma.user.findFirst({ where: { username } });
  const cardSets = await prisma.cardSet.findMany({
    where: { ownerId: user.id },
  });

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
      {cardSets.map((set) => (
        <div key={set} className={styles.setViewerContainer}>
          <div className={styles.setContainer}>
            <h2>{JSON.parse(set.cards).name}</h2>
            <h3>36 terms</h3>
            <Image
              src="/star.svg"
              alt="star"
              width={24}
              height={24}
              // onClick={starSet}
              className={styles.starButton}
            ></Image>
            <div className={styles.useSetButton}>Use Set</div>
          </div>
        </div>
      ))}
    </>
  );
}
