import styles from "@/styles/header.module.css";
import Link from "next/link";
import { authenticated } from "@/controllers/auth.js";
import { logout } from "@/actions/auth.js";

export default async function Header() {
  if (await authenticated())
    return (
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <h2>Flash Royale</h2>
        </Link>
        <div className={styles.headerLinks}>
          {/* <Link href="/create" className={styles.headerLink}>
            Create
          </Link> */}
          <Link href="/menu" className={styles.headerLink}>
            Menu
          </Link>
          <button onClick={logout} className={styles.headerLink}>
            Logout
          </button>
        </div>
      </header>
    );
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <h2>Flash Royale</h2>
      </Link>
      <div className={styles.headerLinks}>
        <Link href="/login" className={styles.headerLink}>
          Login
        </Link>
        <Link href="/signup" className={styles.headerLink}>
          Sign Up
        </Link>
      </div>
    </header>
  );
}
