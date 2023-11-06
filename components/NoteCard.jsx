import { Button, Card, Text, Badge, ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import FormComponent from "./FormComponent";
import { useRecoilState } from "recoil";
import { noteState } from "@/atoms/noteState";
import {
  IconChecks,
  IconEdit,
  IconReload,
  IconTrash,
} from "@tabler/icons-react";

function NoteCard({
  priority = "low",
  title,
  description,
  dueDate,
  status,
  noteId,
}) {
  const [color, setColor] = useState("blue");
  const [opened, { open, close }] = useDisclosure(false);
  const [notes, setNotes] = useRecoilState(noteState);

  useEffect(() => {
    if (priority === "low") {
      setColor("blue");
    } else if (priority === "medium") {
      setColor("orange");
    } else {
      setColor("red");
    }
  }, [priority]);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/notes");
    const result = await res.json();
    setNotes(result.notes);
  }, [setNotes]);
  

  const deleteNote = async () => {
    const res = await fetch(`/api/note`, {
      method: "DELETE",
      body: JSON.stringify({ noteId: noteId }),
    });
    const result = await res.json();
    fetchData();
  };

  const markNote = async (status) => {
    const res = await fetch(`/api/note`, {
      method: "PATCH",
      body: JSON.stringify({
        noteId: noteId,
        status: status === "active" ? "completed" : "active",
      }),
    });
    const result = await res.json();
    fetchData();
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      className="m-4 col-span-3"
      withBorder
    >
      <div className="flex flex-grow justify-between items-center">
        <Text className="mx-2" fw={500}>
          {title}
        </Text>
        <Badge color={color} variant="light">
          {priority}
        </Badge>
      </div>
      <Text className="mx-2">{dueDate}</Text>

      <Text size="sm" c="dimmed">
        {description}
      </Text>

      <div className="flex flex-grow justify-start items-center space-x-4">
        <Tooltip
          label={status === "active" ? "Mark As Done" : "Mark As Active"}
        >
          <ActionIcon
            variant="filled"
            color={status === "active" ? "green" : "gray"}
            className="w-1/2"
            mt="md"
            radius="md"
            onClick={() => markNote(status)}
            size="lg"
          >
            {status === "active" ? <IconChecks /> : <IconReload />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit Entry">
          <ActionIcon
            variant="filled"
            color="blue"
            className="w-1/2"
            mt="md"
            radius="md"
            onClick={open}
            size="lg"
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <FormComponent
          opened={opened}
          close={close}
          description={description}
          title={title}
          status={status}
          priority={priority}
          noteId={noteId}
          dueDate={dueDate}
          trigger="edit"
        />
        <Tooltip label="Delete Entry">
          <ActionIcon
            variant="filled"
            color="red"
            className="w-1/2"
            mt="md"
            radius="md"
            onClick={deleteNote}
            size="lg"
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </div>
    </Card>
  );
}

export default NoteCard;
