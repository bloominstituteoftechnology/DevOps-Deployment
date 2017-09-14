
/**************************************
 * Express Setup
  *************************************/
const express = require('express');
const app = express();

/**************************************
 * Server!
  *************************************/

const PORT = 8080;
const HOST = '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log('server online');
});

/**************************************
 * Endpoint
  *************************************/

app.get('/', (request, response) => {
  response.send('Hello World!\n');  
});

app.get('/version', (request, response) => {
  response.send('1.0.0\n');
});

