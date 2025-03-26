const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const url = require("url");

const app = express();
const PORT = 3001;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint to fetch and modify content
app.post("/fetch", async (req, res) => {
  try {
    const { url: targetUrl } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Fetch the content from the provided URL
    const response = await axios.get(targetUrl);
    const html = response.data;

    // Use cheerio to parse HTML and selectively replace text content, not URLs
    const $ = cheerio.load(html);
    const baseUrl = new URL(targetUrl).origin;

    // Process text nodes in the body
    $("body *")
      .contents()
      .filter(function () {
        return this.nodeType === 3; // Text nodes only
      })
      .each(function () {
        // Replace text content but not in URLs or attributes
        const text = $(this).text();
        const newText = text.replace(/Yale/g, "Fale").replace(/yale/g, "fale");
        if (text !== newText) {
          $(this).replaceWith(newText);
        }
      });

    // Process title separately
    const title = $("title")
      .text()
      .replace(/Yale/g, "Fale")
      .replace(/yale/g, "fale");
    $("title").text(title);

    // Fix CSS and other resource paths
    $('link[rel="stylesheet"]').each(function () {
      const href = $(this).attr("href");
      if (href && !href.startsWith("http")) {
        $(this).attr("href", new URL(href, baseUrl).href);
      }
    });

    $("script[src]").each(function () {
      const src = $(this).attr("src");
      if (src && !src.startsWith("http")) {
        $(this).attr("src", new URL(src, baseUrl).href);
      }
    });

    $("img[src]").each(function () {
      const src = $(this).attr("src");
      if (src && !src.startsWith("http")) {
        $(this).attr("src", new URL(src, baseUrl).href);
      }
    });

    return res.json({
      success: true,
      content: $.html(),
      title: title,
      originalUrl: targetUrl,
    });
  } catch (error) {
    console.error("Error fetching URL:", error.message);
    return res.status(500).json({
      error: `Failed to fetch content: ${error.message}`,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Faleproxy server running at http://localhost:${PORT}`);
});
