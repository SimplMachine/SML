const cheerio = require("cheerio");
const fs = require("fs");

// Create an array with common web elements used for test automation
const commonWebElements = [
  "button", // <button>
  "a", // <a>
  "input", // <input>
  "select", // <select>
  "textarea", // <textarea>
  "label", // <label>
  "img", // <img>
  "table", // <table>
  "tr", // <tr>
  "td", // <td>
  "th", // <th>
  "dl", // <dl>
  "ul", // <ul>
  "ol", // <ol>
  "li", // <li>
  "form", // <form>
  "link", // <link>
  "nav", // <nav>
  "h1", // <h1>
  "h2", // <h2>
  "h3", // <h3>
  "h4", // <h4>
  "h5", // <h5>
  "h6", // <h6>
  "p", // <p>
  "picture", // <picture>
  "video", // <video>
  "canvas", // <canvas>
  "radio", // <radio>
  "checkbox", // <checkbox>
  "option", // <option>
  "optgroup", // <optgroup>
  "fieldset", // <fieldset>
  "legend", // <legend>
  "datalist", // <datalist>
  ];

  // Function to parse html generated from index for each element in commonWebElements array, then maps through to format the selectors by test-id, custom attribute, id, and a class that is unique among all classes on page into a page object

    function parseHtmlForCommonWebElements(htmlFile, customAttributeName) {
        const selectors = [];
        let noUniqueClassesCount = 0;
        let totalCommonWebElementsCount = 0;
    
        commonWebElements.forEach((element) => {
            htmlFile(element).each(function () {
            const testId = htmlFile(this).attr("testId");
            if (testId) {
                selectors.push({
                selector: `[test-id="${test-id}"]`,
                name: testId.replace(/[^A-Z0-9]+/gi, "_"),
                });
            } else {
                // If no test-id, check for custom attribute
                const customAttribute = htmlFile(this).attr(`${customAttributeName}`);
                if (customAttribute) {
                selectors.push({
                    selector: `[data-test="${customAttribute}"]`,
                    name: customAttribute.replace(/[^A-Z0-9]+/gi, "_"),
                });
            } else {
                // If no custom attribute, check for id
                const id = htmlFile(this).attr("id");
                if (id) {
                selectors.push({
                selector: `#${id}`,
                name: id.replace(/[^A-Z0-9]+/gi, "_"),
                });
            } else {
                // If no id, check for unique class among all classes
                const classes = htmlFile(this).attr("class").split(" ");
                const uniqueClass = classes.find((className) => {
                return htmlFile(`.${className}`).length === 1;
                });
                if (uniqueClass) {
                selectors.push({
                    selector: `.${uniqueClass}`,
                    name: uniqueClass.replace(/[^A-Z0-9]+/gi, "_"),
                });
                } else {
                noUniqueClassesCount++;
                }
            }
            totalCommonWebElementsCount++;
                    }
                }
            });
        });
    
        console.log(`Total common web elements found: ${totalCommonWebElementsCount}`);
    
        return selectors;
        }

module.exports = parseHtmlForCommonWebElements;