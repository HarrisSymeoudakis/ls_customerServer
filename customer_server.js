const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let latestData = {}; // Variable to store the latest JSON data

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update * to your specific origin if needed
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.post('/webhook', (req, res) => {
  // Assuming your JSON data is received in the req.body
  latestData = req.body;
  console.log('Received JSON data:', latestData);
  res.status(200).send('Webhook received successfully');

  // Send a response back to the sender system
  // You can customize the response as needed
  res.status(200).send('Webhook received successfully');
});

// Endpoint to serve the latest JSON data
app.get('/latest', (req, res) => {
  res.json(latestData);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
