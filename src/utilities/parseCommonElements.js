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

const parseElements = (htmlFile, customAttr) => {
  const selectors = {};
  commonWebElements.forEach((element) => {
    selectors[element] = [];
    htmlFile(element)?.each(function () {
      const testId = htmlFile(this).attr("testId");
      const customAttribute = customAttr
        ? htmlFile(this).attr(`${customAttr}`)
        : null;
      const id = htmlFile(this).attr("id");
      const classList = htmlFile(this).attr("class");
      if (testId) {
        selectors[element].push({
          selector: `[test-id="${test - id}"]`,
          name: `${testId.replace(/[^A-Z0-9]+/gi, "_")}_${element}`,
        });
      } else if (customAttribute) {
        selectors[element].push({
          selector: `[data-test="${customAttribute}"]`,
          name: `${customAttribute.replace(/[^A-Z0-9]+/gi, "_")}_${element}`,
        });
      } else if (id) {
        selectors[element].push({
          selector: `#${id}`,
          name: `${id.replace(/[^A-Z0-9]+/gi, "_")}_${element}`,
        });
      } else if (classList) {
        const classes = classList.split(" ");
        const uniqueClass = classes.find(
          (className) => htmlFile(`.${className}`).length === 1
        );
        if (uniqueClass) {
          selectors[element].push({
            selector: `.${uniqueClass}`,
            name: `${uniqueClass.replace(/[^A-Z0-9]+/gi, "_")}_${element}`,
          });
        }
      } else {
        // Do something to add unknown selectors to list?
      }
    });
  });

  return selectors;
};

module.exports = parseElements;
