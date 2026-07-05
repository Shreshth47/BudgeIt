import { auth, db } from "@/firebase/firebase";

export function testFirebase() {
  console.log("Auth:", auth.app.name);
  console.log("Firestore:", db.app.name);
}