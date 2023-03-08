const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const parseHtmlForButtonTags = require("./utilities/parseButtons");
const parseHtmlForInputTags = require("./utilities/parseInputs");
const parseHtmlForHREFTags = require("./utilities/crawlURL");
const formatPOFile = require("./utilities/formatPOFile");

const mainUrl = "http://localhost:3000";

// Simple function that takes in url/filepath variables and returns document
async function fetchDocument(url, filePath) {
  const response = await axios.get(url);
  const document = response.data;
  fs.writeFileSync(filePath, document, { encoding: "utf-8" });
  return document;
}

const formatTitle = (title) => title.replace(/[^A-Z0-9]+/gi, "_");

const createPOFile = (filePath) => {
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);
  const outputFilePath = `PageObjects/${formatTitle($("title").text())}.js`;
  const buttonSelectors = parseHtmlForButtonTags($);
  const inputSelectors = parseHtmlForInputTags($);
  const selectorFileContents = formatPOFile(buttonSelectors, inputSelectors);
  fs.writeFileSync(outputFilePath, selectorFileContents);
};

const mainFilePath = "htmlPages/mainDocument.html";
const htmlPageDir = "./htmlPages";

if (!fs.existsSync(htmlPageDir)) {
  fs.mkdirSync(htmlPageDir);
}
let urlList = [];
fetchDocument(mainUrl, mainFilePath).then((_) => {
  const html = fs.readFileSync(mainFilePath, "utf-8");
  const $ = cheerio.load(html);
  urlList = parseHtmlForHREFTags($, mainUrl);
  // for now include the main url in the list of urls
  urlList.push(mainUrl);
  console.log(urlList);
  urlList.forEach((url) => {
    const filePath = `htmlPages/webDocument_${formatTitle(url)}.html`;
    fetchDocument(url, filePath)
      .then((document) => {
        console.log(`Fetched document and saved to file: ${filePath}`);
        const dir = "./PageObjects";

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        createPOFile(filePath);
      })
      .catch((error) => {
        console.error(`Error fetching document: ${error.message}`);
      });
  });
});

// This needs to be split out into it's own area, I figure we can build it into the website.
// Simple fetch example using axios to get document from URL and then create a file that we use to parse
// Future addition will scrape site map, and generate dynamic documents based on subfolders of url
