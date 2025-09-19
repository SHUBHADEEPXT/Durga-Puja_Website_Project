import React, { useState, useRef, useCallback } from 'react';
import { Upload, MapPin, Star, Calendar, Users, Heart, Share2, Camera, Filter, Search, Plus } from 'lucide-react';

const App = () => {
  const [photos, setPhotos] = useState([
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
    },
    {
      id: 3,
      title: "Grand Light Decoration",
      location: "Andheri West, Mumbai",
      rating: 4.9,
      likes: 234,
      date: "2024-09-13",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
      pandal: "Andheri Cultural Association",
      category: "Modern"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    location: '',
    pandal: '',
    category: 'Traditional',
    image: null
  });

  const fileInputRef = useRef(null);
  const categories = ['All', 'Traditional', 'Modern', 'Eco-Friendly', 'Artistic'];

  const filteredPhotos = photos.filter(photo => {
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.pandal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadForm(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmitUpload = useCallback(() => {
    if (uploadForm.title && uploadForm.location && uploadForm.pandal && uploadForm.image) {
      const newPhoto = {
        id: photos.length + 1,
        title: uploadForm.title,
        location: uploadForm.location,
        pandal: uploadForm.pandal,
        category: uploadForm.category,
        image: uploadForm.image,
        rating: 0,
        likes: 0,
        date: new Date().toISOString().split('T')[0]
      };
      
      setPhotos(prev => [newPhoto, ...prev]);
      setUploadForm({
        title: '',
        location: '',
        pandal: '',
        category: 'Traditional',
        image: null
      });
      setShowUploadModal(false);
      
      // Simulate upload success
      alert('Photo uploaded successfully! 🎉');
    } else {
      alert('Please fill all required fields');
    }
  }, [uploadForm, photos.length]);

  const handleLike = useCallback((photoId) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">🪷</span>
                Durga Puja Pandal Explorer
              </h1>
              <p className="text-orange-100 mt-1">Discover Beautiful Pandals in Bangalore</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Pandal
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{photos.length}</div>
              <div className="text-sm text-orange-100">Total Pandals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{photos.reduce((sum, p) => sum + p.likes, 0)}</div>
              <div className="text-sm text-orange-100">Total Likes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">4.7★</div>
              <div className="text-sm text-orange-100">Average Rating</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pandal name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map(photo => (
            <div key={photo.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="relative">
                <img 
                  src={photo.image} 
                  alt={photo.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {photo.category}
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {photo.rating}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{photo.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{photo.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{photo.pandal}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(photo.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold">{photo.likes}</span>
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No pandals found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-red-600" />
              Add New Pandal
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-red-500 transition-colors"
                >
                  {uploadForm.image ? (
                    <img src={uploadForm.image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Click to upload photo</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <input
                type="text"
                placeholder="Pandal Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <input
                type="text"
                placeholder="Location"
                value={uploadForm.location}
                onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <input
                type="text"
                placeholder="Pandal Name"
                value={uploadForm.pandal}
                onChange={(e) => setUploadForm(prev => ({ ...prev, pandal: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Traditional">Traditional</option>
                <option value="Modern">Modern</option>
                <option value="Eco-Friendly">Eco-Friendly</option>
                <option value="Artistic">Artistic</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpload}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">© 2024 Durga Puja Pandal Explorer | Built with ❤️ for Durga Puja 2024</p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="text-orange-300">🙏 Subho Bijoya 🙏</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
