import styles from "@/styles/sets.module.css";
import Image from "next/image";

import { getDbAsync } from "@/lib/prisma.js";
import { authenticated } from "@/controllers/auth.js";
import Link from "next/link";

export default async function Sets() {
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
    <div className={styles.setsContainer}>
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
        {cardSets.map((set) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
