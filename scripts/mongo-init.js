// MongoDB initialization script
db = db.getSiblingDB('durga-puja');

// Create collections
db.createCollection('pandals');
db.createCollection('users');

// Create indexes for better performance
db.pandals.createIndex({ "location": "text", "title": "text", "pandal": "text" });
db.pandals.createIndex({ "category": 1 });
db.pandals.createIndex({ "createdAt": -1 });

// Insert sample data
db.pandals.insertMany([
  {
    title: "Magnificent Durga Idol at Shivaji Park",
    location: "Shivaji Park, Dadar",
    pandal: "Shivaji Park Sarbojanin",
    category: "Traditional",
    rating: 4.8,
    likes: 156,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Eco-Friendly Theme Pandal",
    location: "Powai, Mumbai", 
    pandal: "Powai Sarbojanin",
    category: "Eco-Friendly",
    rating: 4.6,
    likes: 89,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully!');
