import OpenAI from 'openai';

const openai = import.meta.env.VITE_OPENAI_API_KEY ? new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
}) : null;

export const generateProductImages = async (productName, description, category) => {
  if (!openai) {
    // Fallback to free image sources
    return getFallbackImages(productName, category);
  }

  try {
    const searchQuery = `${productName} ${category} product photography high quality commercial`;
    
    // Note: For production, you should use a backend API to call OpenAI
    // This is just for demonstration
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=6`, {
      headers: {
        'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY' // Replace with your key
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    
    const data = await response.json();
    return data.results.map(img => ({
      url: img.urls.regular,
      thumbnail: img.urls.thumb,
      description: img.alt_description
    }));
  } catch (error) {
    console.error('Error generating images:', error);
    return getFallbackImages(productName, category);
  }
};

const getFallbackImages = (productName, category) => {
  const fallbackImages = {
    liquors: [
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop'
    ],
    vapes: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
      'https://images.pexels.com/photos/7148621/pexels-photo-7148621.jpeg?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
    ],
    cigars: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop'
    ]
  };

  return (fallbackImages[category] || fallbackImages.liquors).map((url, index) => ({
    url,
    thumbnail: url,
    description: `${productName} - Option ${index + 1}`
  }));
};

export default { generateProductImages };
