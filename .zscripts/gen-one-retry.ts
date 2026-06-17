import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

process.on("uncaughtException", (e) => { console.error("[uncaught]", e?.message); process.exit(1); });
process.on("unhandledRejection", (e) => { console.error("[unhandled]", e instanceof Error ? e.message : e); process.exit(1); });

const out = process.argv[2];
const prompt = process.argv[3];
const size = process.argv[4] || "1024x1024";
const maxRetries = 5;

if (fs.existsSync(out) && fs.statSync(out).size > 5000) {
  console.log("skip", out);
  process.exit(0);
}

for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    const zai = await ZAI.create();
    const res = await zai.images.generations.create({ prompt, size: size as any });
    const b64 = res.data?.[0]?.base64;
    if (!b64) throw new Error("no base64");
    fs.writeFileSync(out, Buffer.from(b64, "base64"));
    console.log(`ok (attempt ${attempt})`, out, (fs.statSync(out).size / 1024).toFixed(0) + "KB");
    process.exit(0);
  } catch (e: any) {
    const msg = e?.message?.slice(0, 120) || "unknown";
    if (msg.includes("429") || msg.includes("Too many")) {
      const wait = 8000 * attempt;
      console.error(`retry ${attempt}/${maxRetries} in ${wait}ms — 429`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    console.error("fail", out, msg);
    process.exit(1);
  }
}
console.error("exhausted retries", out);
process.exit(1);
