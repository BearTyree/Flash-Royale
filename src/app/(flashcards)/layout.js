import Header from "@/components/Header";

export default function FlashLayout({ children }) {
  return (
    <>
      <div>
        <Header />
        {children}
      </div>
    </>
  );
}
