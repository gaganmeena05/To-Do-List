import LoginComponent from "@/components/LoginComponent";
import Head from "next/head";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className="min-h-screen bg-black flex flex-grow justify-center items-center">
        <LoginComponent />
      </main>
    </>
  );
}
