// const fs = require("fs");
// const http = require("http");
// const url = require("url");
// const slugify = require("slugify");

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado : ${textIn} \n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   if (err) console.log("ERROR! 💥");
//   console.log(data);
// });

// console.log("Will read file!");

// // Non-blocking, asynchronous way of code

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! 💥");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     if (err) return console.log("ERROR! 💥");
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       if (err) return console.log("ERROR! 💥");
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         if (err) return console.log("ERROR! 💥");
//         console.log("Your file has been written 😁");
//       });
//     });
//   });
// });
// console.log("Will read file!");

// SERVER

// Read the file synchronously & parse JSON
// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// const dataObj = JSON.parse(data);

// const server = http.createServer((req, res) => {
//   const pathName = req.url;

//   if (pathName === "/overview") {
//     res.end("This is the OVERVIEW");
//   } else if (pathName === "/product") {
//     res.end("This is the PRODUCT");
//   } else if (pathName === "/api") {
//     res.writeHead(200, {
//       "Content-Type": "application/json",
//     });
//     res.end(data); // Ensure response is proper JSON
//   } else {
//     res.writeHead(404, {
//       "Content-Type": "text/html",
//       "my-own-header": "hello-world",
//     });
//     res.end("<h1>Page not found</h1>");
//   }
// });

// server.listen(9000, "127.0.0.1", () => {
//   console.log("Listening to requests on port 9000");
// });

//Node Farm Project

const http = require("http");
const fs = require("fs");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./module.js/replaceTemplate");
// Define or Import replaceTemplate function
// Read HTML templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// Read JSON data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// Generate slugs
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// Create Server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];

    // Check if product exists to avoid errors
    if (!product) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("<h1>Product not found!</h1>");
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API Endpoint
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

// Start Server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
