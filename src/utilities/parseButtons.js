const cheerio = require("cheerio");
const fs = require("fs");

// Function to parse html generated from index (ignore file structure right now I was just trying to get something put together for motivation)
// pushes either ids or "unique" classes to a selectors array then maps through to format the selectors into a page object
// currently I wrote this using cypress syntax, but we can write it to be a choice and support different frameworks
// future iterations will use template literals to take the subfolder from previous funtion to create unique PO names
function parseHtmlForButtonTags(inputFilePath) {
  const html = fs.readFileSync(inputFilePath, "utf-8");
  const $ = cheerio.load(html);
  const selectors = [];
  let noUniqueClassesCount = 0;
  let totalButtonCount = 0;

  $("button").each(function () {
    const id = $(this).attr("id");
    if (id) {
      selectors.push(`#${id}`);
    } else {
      const classList = $(this).attr("class");
      if (classList) {
        const classArray = classList.split(" ");
        if (classArray.length === 1) {
          selectors.push(`.${classArray[0]}`);
        } else {
          noUniqueClassesCount++;
        }
      } else {
        noUniqueClassesCount++;
      }
    }
    totalButtonCount++;
  });

  if (noUniqueClassesCount > 0) {
    console.log(
      `Warning: ${noUniqueClassesCount} buttons had no unique class.`
    );
  }

  console.log(`Total button tags found: ${totalButtonCount}`);

  return selectors;
}

module.exports = parseHtmlForButtonTags;
