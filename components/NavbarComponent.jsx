import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import { dayjs } from "@/lib/dayjs";
import { useDisclosure } from "@mantine/hooks";
import FormComponent from "./FormComponent";

function NavbarComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900">
      <div className=" flex flex-grow items-center justify-between p-4">
        <span
          className="self-center text-2xl font-semibold whitespace-nowrap"
          onClick={() => router.push("/")}
        >
          My Tasks
        </span>
        <div className="flex md:order-2 space-x-2">
          {/* <button type="button">Add Task</button> */}
          <Button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={open}
          >
            Add Task
          </Button>
          <FormComponent opened={opened} close={close} trigger="add" />
          <Button
            variant="filled"
            color="red"
            radius="md"
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </Button>
          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <p>
            {status !== "loading" || status !== "unauthenticated"
              ? session?.user?.username
              : "User"}
          </p>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
