import Header from "@/components/Header";
import styles from "@/styles/create.module.css";

<<<<<<<< HEAD:src/app/(flashcards)/layout.js
export default function FlashLayout({ children }) {
========
export default function SetsLayout({ children }) {
>>>>>>>> 6d5f72ee2dcb71d518c2ef4fe55e3ba23bc6e232:src/app/sets/layout.js
  return (
    <>
      <div id={styles.createContent}>
        <Header />
        {children}
      </div>
    </>
  );
}
