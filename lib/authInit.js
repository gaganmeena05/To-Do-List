import { getAuth } from "firebase/auth";
import { init } from "./init";

export async function initAuth() {
    const auth = getAuth(await init());
    auth.useDeviceLanguage();
    
    return auth;
}