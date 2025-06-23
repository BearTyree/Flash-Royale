import Link from "next/link";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default function Win() {
  return (
    <>
      You Won <Link href="/menu">Return to Menu</Link>
    </>
  );
}
