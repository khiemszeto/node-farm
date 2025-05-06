const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


////////
/// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/overview.html`,
  'utf8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/card.html`,
  'utf8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/product.html`,
  'utf8'
);

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data); // An ARRAY of all data

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);
// we put it here because we don't want the browser read the product data again everytime someone go to /api
// THE TRICK HERE IS THAT WE HAVE TO FIGURE IT OUT WHICH CODES WILL BE EXCECUTED ONCE AT THE BEGINNING AND WHICH ONE IS EXCECUTED OVER AND OVER AGAIN

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' }); // here you tell Browser that you will send back 'text/html'

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(''); // join array into one string
    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);

    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const product = dataObj[query.id]; // THIS IS HOW WE RETRIEVE AN ELEMENT BASED ON THE QUERY STRING ON AN JSON ARRAY
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' }); // here you tell Browser that you will send back 'JSON' 'application/json'
    res.end(data);

    //NOT-FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html', // here you tell Browser that you will send back 'text/html'
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
