import RegisterComponent from "@/components/RegisterComponent";
import { Card, TextInput } from "@mantine/core";
import Head from "next/head";
import home from "@/components/HomeComponent";

export default function Register() {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <main className="min-h-screen flex flex-grow justify-center items-center">
        <RegisterComponent />
      </main>
    </>
  );
}
