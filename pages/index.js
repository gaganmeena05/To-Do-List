import HomeComponent from "@/components/HomeComponent";
import NavbarComponent from "@/components/NavbarComponent";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  const {data,status} = useSession();
  
  //fetch notes and send to homebar

  return (
    <main className="min-h-screen bg-black">
      <Head><title>ToDo List</title></Head> 
      <NavbarComponent/>
      <HomeComponent />
    </main>
  )
}

