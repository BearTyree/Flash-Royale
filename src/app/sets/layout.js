import Header from "@/components/Header";
import styles from "@/styles/create.module.css";

export default function FlashLayout({ children }) {
  return (
    <>
      <div id={styles.createContent}>
        <Header />
        {children}
      </div>
    </>
  );
}
