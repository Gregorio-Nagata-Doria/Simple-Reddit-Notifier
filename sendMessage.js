export default async function sendMessage(post) {
  const ntfy_topic = process.env.NTFY_TOPIC;

  const res = await fetch("https://ntfy.sh", {
    method: "POST",
    body: JSON.stringify({
      topic: ntfy_topic,
      title: post.title,
      message: post.link,
      click: post.link,
      priority: 4,
    }),
  });
  if (res.status === 429) {
    console.warn("Rate limited (429)");
    throw new Error("ntfy rate limited (429)");
  }
  if (!res.ok) throw new Error(`ntfy status ${res.status}`);
}
