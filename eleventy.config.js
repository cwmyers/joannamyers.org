export default function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/images");
	eleventyConfig.addPassthroughCopy("src/favicon.svg");
	eleventyConfig.addPassthroughCopy("src/CNAME");

	eleventyConfig.addFilter("dateFmt", (date) =>
		new Date(date).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "long",
			year: "numeric",
		})
	);

	eleventyConfig.addFilter("iso", (date) => new Date(date).toISOString());

	eleventyConfig.addFilter("readingTime", (text) =>
		Math.max(1, Math.round(String(text).split(/\s+/).length / 200))
	);

	eleventyConfig.addFilter("prevIndex", (collection, page) =>
		collection.findIndex((p) => p.url === page.url)
	);
	eleventyConfig.addFilter("previousItem", (collection, page) => {
		const i = collection.findIndex((p) => p.url === page.url);
		return i >= 0 && i < collection.length - 1 ? collection[i + 1] : null;
	});

	eleventyConfig.addFilter("nextItem", (collection, page) => {
		const i = collection.findIndex((p) => p.url === page.url);
		return i > 0 ? collection[i - 1] : null;
	});

	eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

	eleventyConfig.addFilter("head", (arr, n) => arr.slice(0, n));

	eleventyConfig.addFilter("newestFirst", (posts) =>
		[...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
	);

	eleventyConfig.addFilter("first", (arr) => arr[0]);

	eleventyConfig.addFilter("groupByYear", (posts) => {
		const byYear = new Map();
		for (const post of posts) {
			const year = post.date.getFullYear();
			if (!byYear.has(year)) byYear.set(year, []);
			byYear.get(year).push(post);
		}
		return [...byYear.entries()].map(([year, posts]) => ({ year, posts }));
	});

	eleventyConfig.addFilter("xmlEscape", (s) =>
		String(s)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;")
	);

	return {
		dir: { input: "src", output: "_site" },
		// Served at /joannamyers.org/ until the custom domain is live.
		// At cutover, change this to "/" and redeploy.
		pathPrefix: "/joannamyers.org/",
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
	};
}
