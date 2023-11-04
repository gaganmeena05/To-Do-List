import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { initDB } from "@/lib/dbInit";
import { doc, getDoc, addDoc, setDoc } from "firebase/firestore";
import { initAuth } from "@/lib/authInit";
import { signInWithEmailAndPassword } from "firebase/auth";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "string" },
      },
      //@ts-ignore
      async authorize(credentials, req) {
        //checck email and password exist
        if (!(credentials && credentials.email && credentials.password))
          return null;
        const auth = await initAuth();
        const { email, password } = credentials;
        try {
          const { user: authUser } = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          return { uid: authUser.uid };
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    maxAge: 90 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, credentials, account }) {
      try {
        if (!user || !user?.uid || !credentials) return false;
        const email = credentials.email;
        user.email = email;
        const db = await initDB();
        const userRef = doc(db, "users", email);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) return false;
        const userData = userDoc.data();
        user.username = userData.username;
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
      return false;
    },
    // @ts-ignore
    async jwt(jwtObject) {
      try {
        const { user, token } = jwtObject;

        if (user) {
          return {
            ...token,
            email: user?.email,
            username: user?.username,
          };
        }
        return token;
      } catch (err) {
        console.log(err);
      }
    },

    //@ts-ignore
    async session({ session, token }) {
      //@ts-ignore
      session.user.email = token.email;
      //@ts-ignore
      session.user.username = token.username;

      return session;
    },
  },
};
export default NextAuth(authOptions);
