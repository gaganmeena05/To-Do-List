import { useState, React, useCallback } from "react";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import {
  TextInput,
  Modal,
  Button,
  Group,
  Select,
  Textarea,
} from "@mantine/core";
import { dayjs } from "@/lib/dayjs";
import { useRecoilState } from "recoil";
import { noteState } from "@/atoms/noteState";

function FormComponent({
  opened,
  close,
  title = "",
  description = "",
  priority = "low",
  dueDate = dayjs(),
  trigger,
  status = "active",
  noteId = "",
}) {
  const [value, setValue] = useState(dayjs());
  const [notes, setNotes] = useRecoilState(noteState);
  const fetchData = useCallback(async () => {
    const res = await fetch("/api/notes");
    const result = await res.json();
    setNotes(result.notes);
  }, [setNotes]);

  const form = useForm({
    initialValues: {
      title: title,
      description: description,
      priority: priority,
      dueDate: dayjs(dueDate, "DD/MM/YYYY"),
      status: status,
    },
    validate: (values) => ({
      title: values.title.length < 2 ? "Too short title" : null,
      description:
        values.description.length < 3 ? "Too short description" : null,
      dueDate:
        dayjs(values.dueDate, "DD/MM/YYYY").diff(dayjs(), "d") < 0
          ? "Date Should be greater than current date"
          : null,
      priority: values.priority.length < 1 ? "No priority choosen" : null,
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.validate();
    const data = form.values;
    console.log(data)
    data.status = "active";
    if (trigger === "add") {
      const res = await fetch("/api/note", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.errorField === "title" && res.error) {
        form.setFieldError("title", res.error);
      }
      if (res.errorField === "description" && res.error) {
        form.setFieldError("description", res.error);
      }
      if (res.errorField === "dueDate" && res.error) {
        form.setFieldError("dueDate", res.error);
      }
      if (res.errorField === "priority" && res.error) {
        form.setFieldError("priority", res.error);
      }
      if (res.errorField === "status" && res.error) {
        form.setFieldError("status", res.error);
      }
      if (res.error) {
        form.setFieldError("title", res.error);
      }
      if (res.ok) {
        await fetchData();
        close();
        form.reset();
      }
    }
    if (trigger === "edit") {
      if (!noteId) return;
      data.noteId = noteId;
      const res = await fetch("/api/note", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (res.error) {
        form.setFieldError("title", res.error);
      }
      if (res.ok) {
        await fetchData();
        close();
        form.reset();
      }
    }
    form.setValues(data);
  };

  return (
    <Modal opened={opened} onClose={close} title="Add Task" centered>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Title"
          placeholder="Enter Title"
          {...form.getInputProps("title")}
          data-autoocus
        />
        <Textarea
          label="Description"
          placeholder="Enter your Description"
          autosize
          minRows={2}
          {...form.getInputProps("description")}
        />
        <Select
          label="Priority"
          placeholder="Enter Task Priority"
          data={["high", "medium", "low"]}
          {...form.getInputProps("priority")}
        />
        <DatePickerInput
          clearable
          label="Pick date"
          placeholder="Pick date"
          value={value}
          onChange={setValue}
          {...form.getInputProps("dueDate")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
}
export default FormComponent;
