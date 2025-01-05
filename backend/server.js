import axios from 'axios';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

const app = express();

// Load environment variables
config({ path: './config/config.env' });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle currency conversion
app.get('/convert', async (req, res) => {
  const { base_currency, currencies } = req.query;

  if (!base_currency || !currencies) {
    return res.status(400).json({ message: 'base_currency and currencies are required.' });
  }

//   try {
//     const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.API_key}&base=${base_currency}&symbols=${currencies}`;
//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching data:', error.message, error.response?.data);
//     res.status(500).json({ message: 'Error fetching data' });
//   }
// });

try {
  const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.API_key}&base=${base_currency}&symbols=${currencies}`;
  const response = await axios.get(url);
  console.log('API Response:', response.data); // Log response
  res.json(response.data);
} catch (error) {
  console.error('Error fetching data:', error.message, error.response?.data);
  res.status(500).json({ message: 'Error fetching data' });
}
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
