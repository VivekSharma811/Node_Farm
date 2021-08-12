const fs = require('fs')
const http = require('http')
const url = require('url')
const repalceTemplate = require('./modules/replaceTemplate')

///////////////////////////////
//File System


// Synchronous
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is waht we know about Avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('Write operation completed');


//Asynchronous

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
//         console.log(data1)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data2) => {
//             console.log(data2)

//             fs.writeFile('./txt/final.txt', `${data1}\n${data2}`,'utf-8', (err) => {
//                 console.log("Written successfully");
//             })
//         });
//     });
// });
// console.log('Reading start file....');



///////////////////////////////
//Server

const temp_product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const temp_card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const temp_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);



const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    //Overview
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHTML = dataObject.map(el => repalceTemplate(temp_card, el))
        const output = temp_overview.replace('{%PRODUCT_CARDS%}', cardsHTML)

        res.end(output);

        //Product
    } else if(pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObject[query.id];
        const output = repalceTemplate(temp_product, product);

        res.end(output);

        //API
    } else if(pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data)

        //Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found</h1>");
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to 127.0.0.1:8000")
})