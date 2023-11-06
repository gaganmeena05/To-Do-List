import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { useRouter } from "next/router";
import { dayjs } from "@/lib/dayjs";
import { useDisclosure } from "@mantine/hooks";
import FormComponent from "./FormComponent";
import { IconLogout, IconNotes } from "@tabler/icons-react";

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
        <div className="flex space-x-2">
          <FormComponent opened={opened} close={close} trigger="add" />
          <Button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={open}
          >
            Add Tasks
          </Button>
        </div>
        <div className="items-center justify-between md:flex w-auto space-x-4">
          <p className="hidden md:block">
            {status !== "loading" || status !== "unauthenticated"
              ? session?.user?.username
              : "User"}
          </p>
          <Tooltip label="Logout">
            <ActionIcon
              variant="filled"
              color="red"
              radius="sm"
              size="lg"
              onClick={() => {
                signOut();
              }}
            >
              <IconLogout />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
