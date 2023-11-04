// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import init from "./init";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export async function initDB(){
  const app = await init();
  const db = getFirestore(app);
  
  return db;
}

export default initDB;

// Initialize Firebase
