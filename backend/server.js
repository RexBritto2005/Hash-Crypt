const express = require('express');
const cors = require('cors');
const hashRoutes = require('./routes/hash');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', hashRoutes);

app.listen(PORT, () => {
  console.log(`Hash Encrypt API running on http://localhost:${PORT}`);
});
