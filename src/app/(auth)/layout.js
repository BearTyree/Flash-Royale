import Header from "@/components/Header";

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
