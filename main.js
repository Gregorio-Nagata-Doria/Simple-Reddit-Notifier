import getFeed from "./getFeed.js";
import fs from "fs";
import sendMessage from "./sendMessage.js";

if (!fs.existsSync("oldPosts.json")) {
  fs.writeFileSync("oldPosts.json", JSON.stringify([]));
}

async function main() {
  const newFeed = await getFeed();

  const IdSet = new Set(JSON.parse(fs.readFileSync("oldPosts.json", "utf8")));

  const isFirstRun = IdSet.size === 0;
  for (const post of newFeed) {
    if (IdSet.has(post.id)) continue;

    if (isFirstRun) {
      IdSet.add(post.id); 
      continue;
    }

    try {
      await sendMessage(post);
      IdSet.add(post.id); 
      await new Promise((r) => setTimeout(r, 5000)); 
    } catch (erro) {
      console.error(`Failed to notify for ${post.id}:`, erro.message);
    }
  }
  let ids = [...IdSet];

  // reduz o tamanho dos ids ja mandados quando chega perto do 200
  if (ids.length > 190) {
    ids = ids.slice(-100);
  }

  fs.writeFileSync("oldPosts.json", JSON.stringify(ids, null, 2));

  console.log(
    `[${new Date().toISOString()}] ${ids.length} posts conhecidos, checando de novo em 60s`
  );
}
const tick = () =>
  main().catch((err) => console.error("Cycle failed:", err.message));
tick();

setInterval(tick, 60_000);
