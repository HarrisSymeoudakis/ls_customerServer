import axios from 'axios'; // Import Axios for making HTTP requests

import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Encode username and password for Basic Authentication
const username = '90478305_003_TEST\\AI';
const password = '1234';
const auth = Buffer.from(`${username}:${password}`).toString('base64');

// Define headers with Basic Authentication
const headers = {
  'Authorization': `Basic ${auth}`,
  'Content-Type': 'application/json' // Adjust content type if needed
};

let latestData = {}; // Variable to store the latest JSON data
let customerId = ''; 

// Middleware to allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Update * to your specific origin if needed
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Webhook endpoint to receive and store JSON data
app.post('/webhook', (req, res) => {
  latestData = req.body;
  console.log('External Customer Form JSON data:', latestData);

  customerId = latestData.customerId;
  if (!customerId) {
    return res.status(400).send('customerId not found in the request');
  }

  res.status(200).send('External Customer Form JSON received successfully');
});

// Endpoint to serve the latest JSON data
app.get('/latest', (req, res) => {
  res.json(latestData);
});

// Customer User-fields
app.get('/swagger/CustomerUserFields', async (req, res) => {
  try {
	  if (!customerId) {
      return res.status(400).send('customerId not available. Ensure the webhook has been called.');
    }
    
    const url = `https://90478305-partner-retail-ondemand.cegid.cloud/Y2/90478305_003_TEST/api/customers/v2/${customerId}?fields=UserFields`;

    // Define the headers for the request
    const headers = {
	  'Authorization': `Basic ${auth}`,
	  'Content-Type': 'application/json' // Adjust content type if needed
	};

    // Make a GET request to the Swagger page with defined headers
    const response = await axios.get(url, { headers });

    // Assuming the Swagger page returns JSON data
    const swaggerData = response.data;
    console.log('Received JSON data from Customer User fields:', swaggerData);

    // Respond with the data received from the API
    res.json(swaggerData);
  } catch (error) {
    console.error('Error fetching data for customer User fields:', error);
    res.status(500).send('Error fetching data for customer User fields');
  }
});

// Endpoint to make a GET request to the Swagger page with Basic Authentication
app.get('/swagger/customerOrders', async (req, res) => {
  try {
    // Construct the URL dynamically using the extracted customerId
    const baseUrl = 'https://90478305-partner-retail-ondemand.cegid.cloud/Y2/90478305_003_TEST/api/customer-documents/v1';
    const documentType = 'CustomerOrder';
    const url = `${baseUrl}?documentType=${documentType}&customerId=${customerId}&active=true&fields=DiscountsDetail`;

    // Make a GET request to the Swagger page with defined headers
    const response = await axios.get(url, { headers });

    // Assuming the Swagger page returns JSON data
    const swaggerData = response.data;
    console.log('Received JSON data from Customer orders:', swaggerData);

    // Respond with the data received from the API
    res.json(swaggerData);
  } catch (error) {
    console.error('Error fetching data for customer orders:', error);
    res.status(500).send('Error fetching data for customer orders');
  }
});

// Endpoint to make a GET request to the Swagger page with Basic Authentication
app.get('/swagger/customerReservations', async (req, res) => {
  try {
	  if (!customerId) {
      return res.status(400).send('customerId not available. Ensure the webhook has been called.');
    }
    
    const url = `https://90478305-partner-retail-ondemand.cegid.cloud/Y2/90478305_003_TEST/api/customer-reservations/v1?documentTypeId=CustomerReservation&customerId=${customerId}&searchDate.startDate=01%2F01%2F2022&searchDate.endDate=01%2F01%2F2030`;

    // Define the headers for the request
    const headers = {
	  'Authorization': `Basic ${auth}`,
	  'Content-Type': 'application/json' // Adjust content type if needed
	};

    // Make a GET request to the Swagger page with defined headers
    const response = await axios.get(url, { headers });

    // Assuming the Swagger page returns JSON data
    const swaggerData = response.data;
    console.log('Received JSON data from Customer Reservations:', swaggerData);

    // Respond with the data received from the API
    res.json(swaggerData);
  } catch (error) {
    console.error('Error fetching data for customer Reservations:', error);
    res.status(500).send('Error fetching data for customer Reservations');
  }
});

// ADDRESSES
app.get('/swagger/Addresses', async (req, res) => {
  console.log('calling addresses');
  try {
    if (!customerId) {
      return res.status(400).send('customerId not available. Ensure the webhook has been called.');
    }

    // Construct the URL dynamically using the extracted customerId
    const url = `https://90478305-partner-retail-ondemand.cegid.cloud/Y2/90478305_003_TEST/api/customers/${customerId}/addresses/v1`;

    // Define the headers for the request
    const headers = {
	  'Authorization': `Basic ${auth}`,
	  'Content-Type': 'application/json' // Adjust content type if needed
	};

    // Make a GET request to the Swagger page with defined headers
    const response = await axios.get(url, { headers });

    // Assuming the Swagger page returns JSON data
    const swaggerData = response.data;
    console.log('Received JSON data from Addresses:', swaggerData);

    // Respond with the data received from the API
    res.json(swaggerData);
  } catch (error) {
    console.error('Error fetching data from Addresses:', error);
    res.status(500).send('Error fetching data from Addresses');
  }
});


// --------------------- --------------------- SEND PAYLOAD BACK TO Livestore - External Customer form

app.use(bodyParser.json());

app.post('/api/PostBackExtForm', async (req, res) => {
    const { sessionId } = req.body;
    
    const endpoint = `https://retail-services.cegid.cloud/et/pos/pulsarcustomer/externalcustomer/session?sessionId=${sessionId}`;
    
    const postData = {
        "languageIsoCode": "en",
        "customerId": "DE01000021",
        "firstName": "Harris",
        "lastName": "Symeoudakis",
        "gender": "MALE",
        "titleCode": "1",
        "birthDay": 20,
        "birthMonth": 3,
        "birthYear": 1992,
        "emails": [
            {
                "email": "harris.symeoudakis@gmail.com",
                "emailType": "Main",
                "emailConsent": "DEM",
                "qualityCode": null
            }
        ],
        "phones": [
            {
                "phone": "555252",
                "phoneType": "Mobile",
                "phoneConsent": "DEM",
                "qualityCode": null
            }
        ],
        "postalAddresses": [
            {
                "addressLine1": "Zoodohou Pigis 6",
                "addressLine2": "",
                "addressLine3": "",
                "addressLine4": null,
                "addressLine5": null,
                "addressLine6": null,
                "addressLine7": null,
                "addressLine8": null,
                "addressLine9": null,
                "city": "Heraklion,Crete",
                "postalCode": "71307",
                "region": "PACA",
                "country": {
                    "countryIso2Code": "GR",
                    "countryLabel": "Greece"
                },
                "addressConsent": true,
                "qualityCode": null,
                "languageIsoCode": "end"
            }
        ]
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});