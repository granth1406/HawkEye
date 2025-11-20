require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const ScanReport = require('./models/ScanReport.js');

const app = express();
app.use(express.json());

app.get('/status', async (req, res) => {
  try {
    const data = await User.find({});
    const reports = await ScanReport.find({});
    res.status(200).json({ users: data, scanReports: reports });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteAll', async (req, res) => {
  try {
    await User.deleteMany({});
    await ScanReport.deleteMany({});
    res.status(200).json({ message: 'All user and scan report data deleted.' });
  }
  catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/upateUser/:id', async (req, res) => {
  try{
    const updatedUser = await User.findByIdAndUpdate(req.body,req.params.id);
    res.status(200).json({ message: 'Updated Successfully'});
  }catch(err){
    console.error(err);
    res.status(500).json({err});
  }
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`HawkEye server running on port http://localhost:${process.env.PORT}`));
  })

  .catch((err) => console.error('DB connection error:', err));

