const formatPOFile = (elements, title) => {
  const openingContent = `class ${title} {\nconstructor() {\n`;
  const endContent = `}\n}\nmodule.exports = ${title};`;

  let selectorContents = "";

  Object.keys(elements)
    .filter((elementCategory) => elements[elementCategory].length >= 1)
    .map((elementCategory) => {
      selectorContents += `// ${elementCategory} Selectors\n`;
      elements[elementCategory].map((element) => {
        selectorContents += `this.${element.name} = cy.get('${element.selector}');\n`;
      });
    });

  const outputContent = openingContent + selectorContents + endContent;

  return outputContent;
};

module.exports = formatPOFile;
