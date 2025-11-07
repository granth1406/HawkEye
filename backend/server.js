const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/routes.js');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api', authRoutes);
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hawkeyedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Database connection error:', err);
}); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});