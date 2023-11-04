import { initDB } from "@/lib/dbInit";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

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
      for (let i = 0; i < userData.notes.length; i++) {
        const noteId = userData.notes[i];
        if (!noteId) continue;
        const note = await getDoc(noteId);
        if (!note.exists()) continue;
        notes.push({ ...note.data(), id: noteId.id });
      }

      res.status(200).send({ notes });
      return resolve();
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
      return resolve();
    }
  });
}
