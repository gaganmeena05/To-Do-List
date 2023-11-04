import { initializeApp } from "firebase/app";

export async function init() {
    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.API_KEY,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    };
    const app = initializeApp(firebaseConfig);
    return app;
}

export default init;