import { initDB } from "@/lib/dbInit";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
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
      //get one note for get method
      if (req.method === "GET") {
        const noteId = req.query.noteId;
        const db = await initDB();
        const note = await getDoc(doc(db, "notes", noteId));

        if (!note.exists()) {
          res.status(404).send({ error: "Note Not Found" });
          return resolve();
        }
        const noteData = note.data();
        if (noteData.user !== session.user.email) {
          res.status(401).send({ error: "Unauthorized" });
          return resolve();
        }
        res.status(200).send({ note: noteData });
        return resolve();
      }

      if (req.method === "POST") {
        const { title, description, priority, status, dueDate } = JSON.parse(
          req.body
        );

        if (!title) {
          res.status(400).send({
            errorfield: "title",
            error: `Title Empty`,
          });
          return resolve();
        }
        if (!description) {
          res.status(400).send({
            errorfield: "description",
            error: `Description Empty`,
          });
          return resolve();
        }
        if (!priority) {
          res.status(400).send({
            errorfield: "priority",
            error: `Priority Empty`,
          });
          return resolve();
        }
        if (!status) {
          res.status(400).send({
            errorfield: "status",
            error: `Status Empty`,
          });
          return resolve();
        }
        if (!dueDate) {
          res.status(400).send({
            errorfield: "dueDate",
            error: `Due Date Empty`,
          });
          return resolve();
        }

        const db = await initDB();
        const note = collection(db, "notes");
        //update user
        const userDoc = doc(db, "users", session?.user?.email);
        const user = await getDoc(userDoc);
        if (!user.exists()) {
          res.status(404).send({ error: "User Not Found" });
          return resolve();
        }
        const userData = user.data();
        const notes = userData.notes;

        try {
          const newRef = doc(note);
          await setDoc(
            newRef,
            {
              title,
              description,
              priority,
              status,
              dueDate,
              user: session.user.email,
              createdAt: serverTimestamp(),
            },
            {
              merge: true,
            }
          );
          notes.push(newRef);
          await setDoc(
            userDoc,
            {
              notes,
            },
            {
              merge: true,
            }
          );

          res.status(200).send({ success: "Note Created" });
          return resolve();
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
          return resolve();
        }
      }

      if (req.method === "PATCH") {
        const { title, description, priority, status, dueDate, noteId } =
          JSON.parse(req.body);
        if (!noteId) {
          res.status(400).send({
            errorfield: "noteId",
            error: `Note Id Empty`,
          });
          return resolve();
        }
        if (!title && !description && !priority && !status && !dueDate) {
          res.status(400).send({
            error: `No Data to Update`,
          });
          return resolve();
        }

        const db = await initDB();
        const note = doc(db, "notes", noteId);
        try {
          if (status && title) {
            await setDoc(
              note,
              {
                title,
                description,
                priority,
                status,
                dueDate,
                user: session.user.email,
                createdAt: serverTimestamp(),
              },
              {
                merge: true,
              }
            );
            res.status(200).send({ success: "Note Created" });
            return resolve();
          } else {
            await setDoc(
              note,
              {
                status,
              },
              {
                merge: true,
              }
            );
            res.status(200).send({ success: "Note Created" });
            return resolve();
          }
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
          return resolve();
        }
      }

      if (req.method === "DELETE") {
        const { noteId } = JSON.parse(req.body);
        if (!noteId) {
          res.status(400).send({
            errorfield: "noteId",
            error: `Note Id Empty`,
          });
          return resolve();
        }
        const db = await initDB();
        const note = doc(db, "notes", noteId);
        const userDoc = doc(db, "users", session?.user?.email);
        const user = await getDoc(userDoc);
        if (!user.exists()) {
          res.status(404).send({ error: "User Not Found" });
          return resolve();
        }
        const userData = user.data();
        const notes = userData.notes;
        try {
          await deleteDoc(note);
          //update user
          const index = notes.indexOf(noteId);
          if (index > -1) {
            notes.splice(index, 1);
          }
          await setDoc(
            userDoc,
            {
              notes,
            },
            {
              merge: true,
            }
          );

          res.status(200).send({ success: "Note Deleted" });
          return resolve();
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
          return resolve();
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
      return resolve();
    }
  });
}
