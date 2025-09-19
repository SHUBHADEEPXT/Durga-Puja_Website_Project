import express from 'express';
const router = express.Router();

// Sample data (later we'll connect to database)
let pandals = [
  {
    id: 1,
    title: "Magnificent Durga Idol at Shivaji Park",
    location: "Shivaji Park, Dadar",
    rating: 4.8,
    likes: 156,
    date: "2024-09-15",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    pandal: "Shivaji Park Sarbojanin",
    category: "Traditional"
  },
  {
    id: 2,
    title: "Eco-Friendly Theme Pandal",
    location: "Powai, Mumbai",
    rating: 4.6,
    likes: 89,
    date: "2024-09-14",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    pandal: "Powai Sarbojanin",
    category: "Eco-Friendly"
  }
];

// GET /api/pandals - Get all pandals
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let filteredPandals = [...pandals];

    // Filter by category
    if (category && category !== 'All') {
      filteredPandals = filteredPandals.filter(p => p.category === category);
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPandals = filteredPandals.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower) ||
        p.pandal.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: filteredPandals.length,
      data: filteredPandals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// POST /api/pandals - Create new pandal
router.post('/', (req, res) => {
  try {
    const { title, location, pandal, category, image } = req.body;

    // Basic validation
    if (!title || !location || !pandal) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, location, and pandal name'
      });
    }

    const newPandal = {
      id: pandals.length + 1,
      title,
      location,
      pandal,
      category: category || 'Traditional',
      image: image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      rating: 0,
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    };

    pandals.unshift(newPandal);

    res.status(201).json({
      success: true,
      data: newPandal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// PUT /api/pandals/:id/like - Like a pandal
router.put('/:id/like', (req, res) => {
  try {
    const pandalId = parseInt(req.params.id);
    const pandal = pandals.find(p => p.id === pandalId);

    if (!pandal) {
      return res.status(404).json({
        success: false,
        error: 'Pandal not found'
      });
    }

    pandal.likes += 1;

    res.json({
      success: true,
      data: pandal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

export default router;
