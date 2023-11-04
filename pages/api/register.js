import { initAuth } from "@/lib/authInit";
import { initDB } from "@/lib/dbInit";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default async function register(req, res) {
  return new Promise(async (resolve) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send({
          error: `Method NOT allowed. Use POST method`,
        });
        return resolve();
      }
      const { email, username, password } = req.body;
      if (!email) {
        res.status(400).send({
          error: `Email Empty`,
        });
        return resolve();
      }
      if (!username) {
        res.status(400).send({
          error: `Username Empty`,
        });
        return resolve();
      }
      if (!password) {
        res.status(400).send({
          error: `Password Empty`,
        });
        return resolve();
      }

      if (!email.includes("@")) {
        res.status(400).send({
          errorField: "email",
          error: `Email not valid`,
        });
        return resolve();
      }

      if (username.length < 3) {
        res.status(400).send({
          errorField: "username",
          error: `Username Too Short`,
        });
        return resolve();
      }

      if (password.length < 6) {
        res.status(400).send({
          errorField: "password",
          error: `Password Too Short`,
        });
        return resolve();
      }

      //check if username exists in firebase users
      const auth = await initAuth();
      const db = await initDB();
      const userRef = await getDoc(doc(db, "users", email));

      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (err) {
        console.log(err);
        res.status(400).send({
          errorField: "email",
          error: "Email Already Exists",
        });
        return resolve();
      }

      //create user in firestore
      const userDoc = doc(db, "users", email);
      await setDoc(
        userDoc,
        {
          username,
          notes: [],
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      res.status(200).send({ success: "User Created" });
      return resolve();
    } catch (err) {
      //Catch
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
      return resolve();
    }
  });
}
