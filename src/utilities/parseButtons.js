const cheerio = require("cheerio");
const fs = require("fs");

// Function to parse html generated from index (ignore file structure right now I was just trying to get something put together for motivation)
// pushes either ids or "unique" classes to a selectors array then maps through to format the selectors into a page object
// currently I wrote this using cypress syntax, but we can write it to be a choice and support different frameworks
// future iterations will use template literals to take the subfolder from previous funtion to create unique PO names
function parseHtmlForButtonTags(htmlFile) {
  const selectors = [];
  let noUniqueClassesCount = 0;
  let totalButtonCount = 0;

  htmlFile("button").each(function () {
    const id = htmlFile(this).attr("id");
    if (id) {
      selectors.push({
        selector: `#${id}`,
        name: id.replace(/[^A-Z0-9]+/gi, "_"),
      });
    } else {
      const classList = htmlFile(this).attr("class");
      if (classList) {
        const classArray = classList.split(" ");
        if (classArray.length === 1) {
          const className = classArray[0];
          selectors.push({
            selector: `.${className}`,
            name: className.replace(/[^A-Z0-9]+/gi, "_"),
          });
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
