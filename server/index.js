const express = require('express');
const app = express();

const messages = [
  /*
  messages to test client side
  message: {
    created
    id
    userId
    location: {
      lat
      long
    }
  }
  */
];

app.get('/health', (_req, res) => {
  res.send('ok')
});

app.get('/api/messages', (_req, res) => {
  res.json(messages);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

