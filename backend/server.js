import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 8000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

// In-memory storage (replace with database in production)
const papers = new Map();

// Create paper
app.post('/api/papers', (req, res) => {
  try {
    const paper = req.body;
    const paperId = uuidv4();
    const now = new Date().toISOString();
    
    const newPaper = {
      ...paper,
      id: paperId,
      created_at: now,
      updated_at: now
    };
    
    papers.set(paperId, newPaper);
    res.json(newPaper);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create paper' });
  }
});

// Get paper by ID
app.get('/api/papers/:id', (req, res) => {
  try {
    const paper = papers.get(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get paper' });
  }
});

// Update paper
app.put('/api/papers/:id', (req, res) => {
  try {
    const paperId = req.params.id;
    if (!papers.has(paperId)) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    const updatedPaper = {
      ...req.body,
      id: paperId,
      updated_at: new Date().toISOString()
    };
    
    papers.set(paperId, updatedPaper);
    res.json(updatedPaper);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update paper' });
  }
});

// Delete paper
app.delete('/api/papers/:id', (req, res) => {
  try {
    const paperId = req.params.id;
    if (!papers.has(paperId)) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    papers.delete(paperId);
    res.json({ message: 'Paper deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

// List all papers
app.get('/api/papers', (req, res) => {
  try {
    res.json(Array.from(papers.values()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to list papers' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running at http://localhost:${port}`);
});