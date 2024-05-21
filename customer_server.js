const express = require('express');
const axios = require('axios'); // Import Axios for making HTTP requests
const app = express();
const port = process.env.PORT || 3000;

let latestData = {}; // Variable to store the latest JSON data
let returningData = {};
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update * to your specific origin if needed
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.use(express.json());

app.post('/webhook', (req, res) => {
  // Assuming your JSON data is received in the req.body
  latestData = req.body;
  console.log('Received JSON data:', latestData);
  res.status(200).send('Webhook received successfully');
});

app.post('/returning', (req, res) => {
  // Assuming your JSON data is received in the req.body
  returningData = req.body;
  console.log('Received JSON data:', returningData);
  res.status(200).send('Return received successfully');
});

// Endpoint to serve the latest JSON data
app.get('/latest', (req, res) => {
  res.json(latestData);
});

// Endpoint to make a GET request to the Swagger page with Basic Authentication
app.get('/swagger', async (req, res) => {
  console.log('inside swagger call, before call');
  try {
    // Encode username and password for Basic Authentication
    const username = '90478305_003_TEST\\AI';
    const password = '1234';
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    // Define headers with Basic Authentication
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json' // Adjust content type if needed
    };

    // Make a GET request to the Swagger page with defined headers
    console.log('swagger before axios');
    const response = await axios.get('https://90478305-partner-retail-ondemand.cegid.cloud/Y2/90478305_003_TEST/api/customer-documents/v1?documentType=CustomerOrder&storeId=DE01&customerId=HQ00100001', { headers });

    // Assuming the Swagger page returns JSON data
    console.log('before const swagger data');
    const swaggerData = response.data;
    console.log('Received JSON data from API:', swaggerData); // Log the data separately
    res.json(swaggerData); // Send the response to the client
  } catch (error) {
    console.error('Error fetching data from Swagger page:', error);
    res.status(500).send('Error fetching data from Swagger page');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
