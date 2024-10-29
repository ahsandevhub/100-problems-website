import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function GET() {
  try {
    const docRef = doc(db, "progressData", "userProgress");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return new Response(JSON.stringify(docSnap.data()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "No data found" }), {
        status: 404,
      });
    }
  } catch (err) {
    console.error("Error reading data:", err);
    return new Response(JSON.stringify({ error: "Error reading data" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newProgress = body.progress;

    await setDoc(doc(db, "progressData", "userProgress"), {
      progress: newProgress,
    });
    return new Response(
      JSON.stringify({ message: "Progress saved successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving data:", err);
    return new Response(JSON.stringify({ error: "Error saving data" }), {
      status: 500,
    });
  }
}
