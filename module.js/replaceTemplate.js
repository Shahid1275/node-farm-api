module.exports = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); // ✅ Add this
  output = output.replace(/{%FROM%}/g, product.from); // ✅ Add this
  // Properly replace the organic/inorganic class and text
  output = output.replace(
    /{%NOT_ORGANIC%}/g,
    product.organic ? "organic" : "not-organic"
  );

  return output;
};
