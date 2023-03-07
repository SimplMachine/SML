const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const parseHtmlForButtonTags = require("./utilities/parseButtons");
const parseHtmlForInputTags = require("./utilities/parseInputs");
const parseHtmlForHREFTags = require("./utilities/crawlURL");
const formatPOFile = require("./utilities/formatPOFile");

// Simple function that takes in url/filepath variables and returns document
async function fetchDocument(url, filePath) {
  const response = await axios.get(url);
  const document = response.data;
  fs.writeFileSync(filePath, document, { encoding: "utf-8" });
  return document;
}

const formatTitle = (title) => title.replace(/[^A-Z0-9]+/gi, "_");

const createPOFile = (url) => {
  const inputFilePath = "webDocument.html";
  const html = fs.readFileSync(inputFilePath, "utf-8");
  const $ = cheerio.load(html);
  const outputFilePath = `PageObjects/${formatTitle($("title").text())}.js`;
  const buttonSelectors = parseHtmlForButtonTags($);
  const inputSelectors = parseHtmlForInputTags($);
  const hrefTags = parseHtmlForHREFTags($, url);
  const selectorFileContents = formatPOFile(buttonSelectors, inputSelectors);
  fs.writeFileSync(outputFilePath, selectorFileContents);
  console.log(hrefTags);
};

// This needs to be split out into it's own area, I figure we can build it into the website.
// Simple fetch example using axios to get document from URL and then create a file that we use to parse
// Future addition will scrape site map, and generate dynamic documents based on subfolders of url
const url = "http://localhost:3000/";
const filePath = "webDocument.html";
fetchDocument(url, filePath)
  .then((document) => {
    console.log(`Fetched document and saved to file: ${filePath}`);
    const dir = "./PageObjects";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    createPOFile(url);
  })
  .catch((error) => {
    console.error(`Error fetching document: ${error.message}`);
  });
