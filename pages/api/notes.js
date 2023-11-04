import { initDB } from "@/lib/dbInit";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { dayjs } from "@/lib/dayjs";

export default async function register(req, res) {
  return new Promise(async (resolve) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        res.status(401).send({ error: "Unauthorized" });
        return resolve();
      }
      if (req.method !== "GET") {
        res.status(405).send({
          error: `Method NOT allowed. Use GET method`,
        });
        return resolve();
      }

      if (!session) {
        res.status(401).send({ error: "Unauthorized" });
        return resolve();
      }
      //   res.send({a:"200"})

      //get all notes for a given user
      const db = await initDB();
      const userDoc = doc(db, "users", session?.user?.email);
      const user = await getDoc(userDoc);
      if (!user.exists()) {
        res.status(404).send({ error: "User Not Found" });
        return resolve();
      }
      const userData = user.data();
      const notes = [];
      if (userData.notes.length === 0) {
        res.status(200).send({});
      }
      for (let i = 0; i < userData.notes.length; i++) {
        const noteId = userData.notes[i];
        if (!noteId) continue;
        const note = await getDoc(noteId);
        if (!note.exists()) continue;
        notes.push({ ...note.data(), id: noteId.id });
      }

      notes.sort((a, b) => {
        //sort by status, then by duedate, then by priority, last by created at
        if (a.status !== b.status) return a.status === "completed" ? 1 : -1;
        if (a.dueDate !== b.dueDate)
          return dayjs(a.dueDate, "DD/MM/YYYY").diff(
            dayjs(b.dueDate, "DD/MM/YYYY"),
            "d"
          );
          //priortiy high comes first,mediumm then low
          if(a.priority === "high" && b.priority === "medium") return -1
          if(a.priority === "high" && b.priority === "low") return -1
          if(a.priority === "medium" && b.priority === "low") return -1
          if(a.priority === "medium" && b.priority === "high") return 1
          if(a.priority === "low" && b.priority === "high") return 1
          if(a.priority === "low" && b.priority === "medium") return 1
          
        return dayjs(a.createdAt, "DD/MM/YYYY").diff(
          dayjs(b.createdAt, "DD/MM/YYYY"),
          "d"
        );
      });

      res.status(200).send({ notes });
      return resolve();
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "In" });
      return resolve();
    }
  });
}
