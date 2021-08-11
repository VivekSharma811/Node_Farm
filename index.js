const fs = require('fs')
const http = require('http')
const url = require('url')

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

const repalceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

const temp_product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const temp_card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const temp_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);



const server = http.createServer((req, res) => {
    const pathName = req.url

    //Overview
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHTML = dataObject.map(el => repalceTemplate(temp_card, el))
        const output = temp_overview.replace('{%PRODUCT_CARDS%}', cardsHTML)

        res.end(output);

        //Product
    } else if(pathName === '/product') {
        res.end("This is the PRODUCT");

        //API
    } else if(pathName === '/api') {
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