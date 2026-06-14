import Parser from "rss-parser";

export default async function getFeed() {
  const res = await fetch(process.env.REDDIT_URL, {
    headers: {
      "User-Agent": `script:simple-reddit-notifier:v1.0.0 (by /u/${process.env.REDDIT_USERNAME})`,
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!res.ok) throw new Error(`Status code ${res.status}`);

  const xml = await res.text();

  const parser = new Parser();
  const feed = await parser.parseString(xml);

  return feed.items;
}
