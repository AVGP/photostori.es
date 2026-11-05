const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Pass through assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Date formatting filter
  eleventyConfig.addFilter("prettyDate", (dateObj) => {
    // If it's a string, parse it
    const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
    return date.toLocaleDateString("en-UK", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // Keep date formatting consistent without timezone shifts
    });
  });

  // Date formatting filter
  eleventyConfig.addFilter("prettyDateLong", (dateObj) => {
    // If it's a string, parse it
    const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
    return date.toLocaleDateString("en-UK", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Keep date formatting consistent without timezone shifts
    });
  });

  eleventyConfig.addFilter("year", (dateObj) => {
    const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
    return date.getFullYear();
  });

  // RSS feed please
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/feed.xml",
    collection: {
      name: "prints", // iterate over `collections.posts`
      limit: 0,     // 0 means no limit
      sort: "auto",  // or "descending", "ascending"
    },
    metadata: {
      language: "en",
      title: "PHOTOSTORI.ES",
      subtitle: "Photographs by Martin Splitt. The back written by Eva Mermingi.",
      base: "https://photostori.es/",
      author: {
        name: "Eva Mermingi & Martin Splitt",
      }
    }
  });

  // just in case you use Windows. I pity the pain.
	eleventyConfig.setChokidarConfig({
		usePolling: true,
		interval: 500,
	});

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"]
  };
};
