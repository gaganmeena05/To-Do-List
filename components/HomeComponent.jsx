import { useRecoilState } from "recoil";
import NoteCard from "./NoteCard";
import { noteState } from "@/atoms/noteState";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function HomeComponent() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useRecoilState(noteState);
  const [loading, setLoading] = useState(false);

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
    <div className="w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12">
      {notes &&
        notes.map((note) => {
          return (
            <NoteCard
              key={note.id}
              noteId={note.id}
              title={note.title}
              description={note.description}
              priority={note.priority}
              date={note.dueDate}
              status={note.status}
            />
          );
        })}
    </div>
  );
}

export default HomeComponent;
