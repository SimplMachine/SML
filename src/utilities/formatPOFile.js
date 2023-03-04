const formatPOFile = (buttonSelectors, inputSelectors) => {
  const buttons = buttonSelectors
    .map(
      (button) => `const ${button.name}_button = cy.get('${button.selector}');`
    )
    .join("\n");
  const inputFields = inputSelectors
    .map((input) => `const ${input.name}_input = cy.get('${input.selector}');`)
    .join("\n");

  // I do not like this, but as we add more selector types and what not, we can clean this up
  const outputContent =
    "// Button Selectors" +
    "\n" +
    buttons +
    "\n" +
    "// Input Selectors" +
    "\n" +
    inputFields;

  return outputContent;
};

module.exports = formatPOFile;
