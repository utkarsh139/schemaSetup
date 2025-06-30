const express = require('express');
const mongoose = require('mongoose');
const Announcement = require('./models/Announcement');

// Initialize Express
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/announcementsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes

// Create an announcement
app.post('/announcements', async (req, res) => {
  try {
    const announcement = new Announcement({
      title: req.body.title,
      description: req.body.description
    });
    
    const savedAnnouncement = await announcement.save();
    res.status(201).send(savedAnnouncement);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all announcements
app.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.send(announcements);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get a single announcement
app.get('/announcements/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).send({ error: 'Announcement not found' });
    }
    res.send(announcement);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update an announcement
app.patch('/announcements/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!announcement) {
      return res.status(404).send({ error: 'Announcement not found' });
    }
    res.send(announcement);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete an announcement
app.delete('/announcements/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).send({ error: 'Announcement not found' });
    }
    res.send({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});