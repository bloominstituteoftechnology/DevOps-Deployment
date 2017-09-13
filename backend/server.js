
/**************************************
 * Express Setup
  *************************************/
const express = require('express');
const app = express();

/**************************************
 * Server!
  *************************************/

const port = 8081;
const server = app.listen(port, () => {
  console.log('server online');
});

/**************************************
 * Endpoint
  *************************************/

app.get('/', (request, response) => {
  response.send('Hello World!\n');  
});

app.get('/version', (request, response) => {
  response.send('1.0.0');
}

