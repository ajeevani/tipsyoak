import React, { useState, useEffect } from 'react';
import DialogOverlaySystem from '../../../components/ui/DialogOverlaySystem'; // FIXED: Changed from named to default import
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { generateProductImages } from '../../../services/openai';

const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null,
  existingProducts = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'liquors',
    description: '',
    price: '',
    alcoholPercentage: '',
    nicotinePercentage: '',
    tobaccoPercentage: '',
    image: '',
    stock: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAIImages, setShowAIImages] = useState(false);
  const [aiImages, setAiImages] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'liquors',
        description: product.description || '',
        price: product.price?.toString() || '',
        alcoholPercentage: product.alcoholPercentage?.toString() || '',
        nicotinePercentage: product.nicotinePercentage?.toString() || '',
        tobaccoPercentage: product.tobaccoPercentage?.toString() || '',
        image: product.image || '',
        stock: product.stock?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'liquors',
        description: '',
        price: '',
        alcoholPercentage: '',
        nicotinePercentage: '',
        tobaccoPercentage: '',
        image: '',
        stock: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (existingProducts.some(p => p.name === formData.name && p.id !== product?.id)) {
      newErrors.name = 'Product name already exists';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    // Category-specific validations
    if (formData.category === 'liquors' && formData.alcoholPercentage) {
      const alcohol = parseFloat(formData.alcoholPercentage);
      if (alcohol < 0 || alcohol > 100) {
        newErrors.alcoholPercentage = 'Alcohol percentage must be between 0-100';
      }
    }
    
    if (formData.category === 'vapes' && formData.nicotinePercentage) {
      const nicotine = parseFloat(formData.nicotinePercentage);
      if (nicotine < 0 || nicotine > 50) {
        newErrors.nicotinePercentage = 'Nicotine percentage must be between 0-50';
      }
    }
    
    if (formData.category === 'cigars' && formData.tobaccoPercentage) {
      const tobacco = parseFloat(formData.tobaccoPercentage);
      if (tobacco < 0 || tobacco > 100) {
        newErrors.tobaccoPercentage = 'Tobacco percentage must be between 0-100';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        alcoholPercentage: formData.alcoholPercentage ? parseFloat(formData.alcoholPercentage) : null,
        nicotinePercentage: formData.nicotinePercentage ? parseFloat(formData.nicotinePercentage) : null,
        tobaccoPercentage: formData.tobaccoPercentage ? parseFloat(formData.tobaccoPercentage) : null,
        stock: parseInt(formData.stock)
      };
      
      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIImages = async () => {
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: 'Product name is required for AI image generation' });
      return;
    }
    
    setLoadingAI(true);
    try {
      const images = await generateProductImages(formData.name, formData.description, formData.category);
      setAiImages(images);
      setShowAIImages(true);
    } catch (error) {
      console.error('Error generating AI images:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSelectAIImage = (image) => {
    setFormData({ ...formData, image: image.url });
    setShowAIImages(false);
  };

  const categoryOptions = [
    { value: 'liquors', label: 'Liquors' },
    { value: 'vapes', label: 'Vapes' },
    { value: 'cigars', label: 'Cigars' }
  ];

  const getPercentageField = () => {
    switch (formData.category) {
      case 'liquors':
        return (
          <Input
            label="Alcohol Percentage (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.alcoholPercentage}
            onChange={(e) => setFormData({ ...formData, alcoholPercentage: e.target.value })}
            error={errors.alcoholPercentage}
          />
        );
      case 'vapes':
        return (
          <Input
            label="Nicotine Percentage (%)"
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={formData.nicotinePercentage}
            onChange={(e) => setFormData({ ...formData, nicotinePercentage: e.target.value })}
            error={errors.nicotinePercentage}
          />
        );
      case 'cigars':
        return (
          <Input
            label="Tobacco Percentage (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.tobaccoPercentage}
            onChange={(e) => setFormData({ ...formData, tobaccoPercentage: e.target.value })}
            error={errors.tobaccoPercentage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <DialogOverlaySystem
        isOpen={isOpen}
        onClose={onClose}
        title={product ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            required
          />
          
          <textarea
            placeholder="Product Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px]"
            required
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              required
            />
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              error={errors.stock}
              required
            />
          </div>

          {getPercentageField()}

          {/* Image Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="flex gap-2">
              <Input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleGenerateAIImages}
                disabled={loadingAI}
                variant="outline"
              >
                {loadingAI ? 'Generating...' : 'Use AI'}
              </Button>
            </div>
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogOverlaySystem>

      {/* AI Images Selection Modal */}
      <DialogOverlaySystem
        isOpen={showAIImages}
        onClose={() => setShowAIImages(false)}
        title="Select AI Generated Image"
        size="xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {aiImages.map((image, index) => (
            <div
              key={index}
              className="cursor-pointer border-2 border-transparent hover:border-red-500 rounded-lg overflow-hidden transition-colors"
              onClick={() => handleSelectAIImage(image)}
            >
              <img
                src={image.url}
                alt={image.description}
                className="w-full h-32 object-cover"
              />
              <p className="p-2 text-xs text-gray-600">
                {image.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => setShowAIImages(false)}
            variant="outline"
          >
            Close
          </Button>
        </div>
      </DialogOverlaySystem>
    </>
  );
};

export default ProductFormModal;
