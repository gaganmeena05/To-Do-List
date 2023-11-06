import { useRecoilState, useRecoilValue } from "recoil";
import NoteCard from "./NoteCard";
import {
  filterState,
  filteredTodoListState,
  noteState,
} from "@/atoms/noteState";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Select } from "@mantine/core";

function HomeComponent() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useRecoilState(noteState);
  const [loading, setLoading] = useState(false);
  const filteredNotes = useRecoilValue(filteredTodoListState);
  const [filterValue, setFilterValue] = useRecoilState(filterState);

  // Fetch notes from database
  useEffect(() => {
    // If user is logged in
    if (status !== "loading" && session) {
      const fetchData = async () => {
        setLoading(true);
        const res = await fetch("/api/notes");
        const result = await res.json();
        setNotes(result.notes);
        setLoading(false);
      };
      fetchData();
    }
  }, [status, session, setNotes]);

  // use;
  return (
    <>
      <div className="flex flex-grow justify-center items-center my-4">
        <Select
          placeholder="All"
          data={["All", "Active", "Completed"]}
          value={filterValue}
          onChange={setFilterValue}
          className="w-[90%] md:w-1/2 lg:w-1/3"
        />
      </div>
      <div className="w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
        {filteredNotes &&
          filteredNotes.map((note) => {
            return (
              <NoteCard
                key={note.id}
                noteId={note.id}
                title={note.title}
                description={note.description}
                priority={note.priority}
                dueDate={note.dueDate}
                status={note.status}
              />
            );
          })}
      </div>
    </>
  );
}

export default HomeComponent;
