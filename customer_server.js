const express = require('express');
const app = express();
const port = process.env.PORT || 10010;

app.use(express.json());

app.post('/webhook', (req, res) => {
  // Assuming your JSON data is received in the req.body
  const jsonData = req.body;

  // Log the JSON data
  console.log('Received JSON data:', jsonData);

  // Assuming you want to send back the same JSON data received
  res.json(jsonData);

  // Send a response back to the sender system
  // You can customize the response as needed
  res.status(200).send('Webhook received successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
