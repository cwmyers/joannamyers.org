export default {
	layout: "post.njk",
	tags: ["posts"],
	eleventyComputed: {
		permalink(data) {
			// Keep migrated Blogger-style URLs (/YYYY/MM/slug.html).
			// Posts created later (e.g. via the CMS) get the same style automatically.
			if (data.permalink) return data.permalink;
			const d = new Date(data.date);
			const mm = String(d.getMonth() + 1).padStart(2, "0");
			return `/${d.getFullYear()}/${mm}/${data.page.fileSlug}.html`;
		},
	},
};
