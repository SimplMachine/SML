const axios = require("axios");
const fs = require("fs");
const parseHtmlForButtonTags = require("./utilities/parseButtons");

// Simple function that takes in url/filepath variables and returns document
async function fetchDocument(url, filePath) {
  const response = await axios.get(url);
  const document = response.data;
  fs.writeFileSync(filePath, document, { encoding: "utf-8" });
  return document;
}
const createPOFile = () => {
  const inputFilePath = "webDocument.html";
  const outputFilePath = "selectors.js";
  const buttonSelectors = parseHtmlForButtonTags(inputFilePath);
  const selectorFileContents = buttonSelectors
    .map((selector) => `cy.get('${selector}');`)
    .join("\n");
  fs.writeFileSync(outputFilePath, selectorFileContents);
};

// This needs to be split out into it's own area, I figure we can build it into the website.
// Simple fetch example using axios to get document from URL and then create a file that we use to parse
// Future addition will scrape site map, and generate dynamic documents based on subfolders of url
const url = "http://localhost:3000/";
const filePath = "webDocument.html";
fetchDocument(url, filePath)
  .then((document) => {
    console.log(`Fetched document and saved to file: ${filePath}`);
    createPOFile();
  })
  .catch((error) => {
    console.error(`Error fetching document: ${error.message}`);
  });
