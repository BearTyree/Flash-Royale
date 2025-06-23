import Link from "next/link";

export const metadata = {
  title: "Flash Royale",
  description: "Flashcard based learning game.",
};

export default function Lose() {
  return (
    <>
      You Lost <Link href="/menu">Return to Menu</Link>
    </>
  );
}
