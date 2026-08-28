#!/usr/bin/env python3
"""One-time migration: pull all posts from the Blogger Atom feed and write
them as Eleventy HTML posts, preserving the original Blogger URL paths
(/YYYY/MM/slug.html) so existing links keep working."""

import html
import json
import re
import urllib.request
from pathlib import Path

FEED_URL = "https://www.joannamyers.org/feeds/posts/default?alt=json&max-results=1000"
OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "posts"


def fetch():
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": "migrator/1.0"})
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def yaml_quote(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ") + '"'


def main():
    data = fetch()
    entries = data["feed"].get("entry", [])
    print(f"Fetched {len(entries)} entries")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for e in entries:
        title = e["title"]["$t"]
        date = e["published"]["$t"][:19]
        cats = [c["term"] for c in e.get("category", [])]
        body = e.get("content", {}).get("$t", "")
        url = next(l["href"] for l in e["link"] if l["rel"] == "alternate")
        path = re.sub(r"^https?://[^/]+", "", url)  # /YYYY/MM/slug.html

        # Description: first ~160 chars of plain text (tags stripped, entities decoded)
        text = re.sub(r"<[^>]+>", " ", body)
        text = html.unescape(text)
        text = re.sub(r"\s+", " ", text).strip()
        desc = text[:160].rsplit(" ", 1)[0] + "…" if len(text) > 160 else text

        frontmatter = (
            f"---\n"
            f"title: {yaml_quote(title)}\n"
            f"date: {yaml_quote(date)}\n"
            f"permalink: {yaml_quote(path)}\n"
            f"description: {yaml_quote(desc)}\n"
            f"tags:\n" + "".join(f"  - {yaml_quote(c)}\n" for c in cats) +
            f"---\n\n"
        )

        rel = path.lstrip("/")  # 2026/08/slug.html
        out = OUT_DIR / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(frontmatter + body, encoding="utf-8")
        print(f"  wrote {rel}")

    print("Done.")


if __name__ == "__main__":
    main()
