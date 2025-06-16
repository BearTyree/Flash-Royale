import styles from "@/styles/sets.module.css";

import { getDbAsync } from "@/lib/prisma.js";
import { authenticated } from "@/controllers/auth.js";
import SetsList from "./SetsList";
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
        <Link href="/create" className={styles.setButton}>
          Create New Set
        </Link>
      </div>

      <div className={styles.setViewerContainer}>
        <SetsList cardSets={cardSets} />
      </div>
    </div>
  );
}
