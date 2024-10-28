import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "public", "data.json");

export async function GET(req) {
  try {
    const data = await fs.promises.readFile(dataFilePath, "utf8");
    const jsonData = JSON.parse(data);
    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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

    await fs.promises.writeFile(
      dataFilePath,
      JSON.stringify({ progress: newProgress }, null, 2),
      "utf8"
    );
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
