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
  res.send("Faleproxy server is running");
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

    // Function to replace text while preserving URLs and attributes
    function replaceText(text) {
      return text.replace(/Yale/g, "Fale").replace(/yale/g, "fale");
    }

    // Process text nodes in the body
    $("body *")
      .contents()
      .filter(function () {
        return this.nodeType === 3; // Text nodes only
      })
      .each(function () {
        const text = $(this).text();
        const newText = replaceText(text);
        if (text !== newText) {
          $(this).replaceWith(newText);
        }
      });

    // Process title separately
    const title = replaceText($("title").text());
    $("title").text(title);

    // Process meta tags
    $('meta[name="description"]').each(function () {
      const content = $(this).attr("content");
      if (content) {
        $(this).attr("content", replaceText(content));
      }
    });

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

    // Process title and placeholder attributes that might contain text
    $("[title], [placeholder]").each(function () {
      const element = $(this);
      ["title", "placeholder"].forEach((attr) => {
        const value = element.attr(attr);
        if (value) {
          element.attr(attr, replaceText(value));
        }
      });
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
