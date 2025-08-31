import React, { useState, useEffect } from 'react';
import DialogOverlaySystem from '../../../components/ui/DialogOverlaySystem';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null, 
  existingProducts = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    alcoholPercentage: '',
    nicotinePercentage: '',
    tobaccoPercentage: '',
    description: '',
    image: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const categoryOptions = [
    { value: 'liquors', label: 'Liquors' },
    { value: 'vapes', label: 'Vapes' },
    { value: 'cigars', label: 'Cigars' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        category: product?.category || '',
        price: product?.price?.toString() || '',
        stock: product?.stock?.toString() || '',
        alcoholPercentage: product?.alcoholPercentage?.toString() || '',
        nicotinePercentage: product?.nicotinePercentage?.toString() || '',
        tobaccoPercentage: product?.tobaccoPercentage?.toString() || '',
        description: product?.description || '',
        image: product?.image || '',
        isActive: product?.isActive !== false
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        alcoholPercentage: '',
        nicotinePercentage: '',
        tobaccoPercentage: '',
        description: '',
        image: '',
        isActive: true
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Product name is required';
    } else if (existingProducts?.some(p => 
      p?.name?.toLowerCase() === formData?.name?.toLowerCase() && 
      (!product || p?.id !== product?.id)
    )) {
      newErrors.name = 'Product name must be unique';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.price || isNaN(formData?.price) || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData?.stock || isNaN(formData?.stock) || parseInt(formData?.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (formData?.category === 'liquors' && formData?.alcoholPercentage) {
      const alcohol = parseFloat(formData?.alcoholPercentage);
      if (isNaN(alcohol) || alcohol < 0 || alcohol > 100) {
        newErrors.alcoholPercentage = 'Alcohol percentage must be between 0-100';
      }
    }

    if (formData?.category === 'vapes' && formData?.nicotinePercentage) {
      const nicotine = parseFloat(formData?.nicotinePercentage);
      if (isNaN(nicotine) || nicotine < 0 || nicotine > 100) {
        newErrors.nicotinePercentage = 'Nicotine percentage must be between 0-100';
      }
    }

    if (formData?.category === 'cigars' && formData?.tobaccoPercentage) {
      const tobacco = parseFloat(formData?.tobaccoPercentage);
      if (isNaN(tobacco) || tobacco < 0 || tobacco > 100) {
        newErrors.tobaccoPercentage = 'Tobacco percentage must be between 0-100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const generateAiSuggestions = async () => {
    if (!formData?.name?.trim()) {
      setErrors(prev => ({ ...prev, name: 'Enter product name first' }));
      return;
    }

    setIsLoading(true);
    setShowAiSuggestions(true);

    // Mock AI suggestions (replace with actual OpenAI API call)
    setTimeout(() => {
      const mockSuggestions = [
        `https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop`,
        `https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?w=400&h=400&fit=crop`,
        `https://images.pixabay.com/photo/2016/03/27/21/34/bottle-1284459_960_720.jpg?w=400&h=400&fit=crop`,
        `https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop`
      ];
      
      setAiSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: parseFloat(formData?.price),
      stock: parseInt(formData?.stock),
      alcoholPercentage: formData?.alcoholPercentage ? parseFloat(formData?.alcoholPercentage) : null,
      nicotinePercentage: formData?.nicotinePercentage ? parseFloat(formData?.nicotinePercentage) : null,
      tobaccoPercentage: formData?.tobaccoPercentage ? parseFloat(formData?.tobaccoPercentage) : null,
      id: product?.id || Date.now(),
      createdAt: product?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    onSave(productData);
    onClose();
  };

  const renderPercentageField = () => {
    switch (formData?.category) {
      case 'liquors':
        return (
          <Input
            label="Alcohol Percentage"
            type="number"
            placeholder="e.g., 40"
            value={formData?.alcoholPercentage}
            onChange={(e) => handleInputChange('alcoholPercentage', e?.target?.value)}
            error={errors?.alcoholPercentage}
            min="0"
            max="100"
            step="0.1"
          />
        );
      case 'vapes':
        return (
          <Input
            label="Nicotine Percentage"
            type="number"
            placeholder="e.g., 3"
            value={formData?.nicotinePercentage}
            onChange={(e) => handleInputChange('nicotinePercentage', e?.target?.value)}
            error={errors?.nicotinePercentage}
            min="0"
            max="100"
            step="0.1"
          />
        );
      case 'cigars':
        return (
          <Input
            label="Tobacco Percentage"
            type="number"
            placeholder="e.g., 85"
            value={formData?.tobaccoPercentage}
            onChange={(e) => handleInputChange('tobaccoPercentage', e?.target?.value)}
            error={errors?.tobaccoPercentage}
            min="0"
            max="100"
            step="0.1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <DialogOverlaySystem
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      description={product ? 'Edit the product details below' : 'Fill in the product information to add a new product'}
      size="xl"
      className="max-h-[90vh] overflow-hidden"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            type="text"
            placeholder="Enter product name"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />
          
          <Select
            label="Category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            error={errors?.category}
            placeholder="Select category"
            required
          />
        </div>

        {/* Pricing and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (USD)"
            type="number"
            placeholder="0.00"
            value={formData?.price}
            onChange={(e) => handleInputChange('price', e?.target?.value)}
            error={errors?.price}
            min="0"
            step="0.01"
            required
          />
          
          <Input
            label="Stock Quantity"
            type="number"
            placeholder="0"
            value={formData?.stock}
            onChange={(e) => handleInputChange('stock', e?.target?.value)}
            error={errors?.stock}
            min="0"
            required
          />
        </div>

        {/* Category-specific percentage field */}
        {formData?.category && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderPercentageField()}
            <div className="flex items-end">
              <Checkbox
                label="Active Product"
                description="Product will be visible to customers"
                checked={formData?.isActive}
                onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            placeholder="Enter product description..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
          />
        </div>

        {/* Image Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              Product Image
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateAiSuggestions}
              loading={isLoading}
              iconName="Sparkles"
              iconPosition="left"
            >
              AI Suggestions
            </Button>
          </div>

          <Input
            type="url"
            placeholder="Enter image URL or upload below"
            value={formData?.image}
            onChange={(e) => handleInputChange('image', e?.target?.value)}
          />

          {formData?.image && (
            <div className="w-32 h-32 border border-border rounded-lg overflow-hidden bg-muted">
              <Image
                src={formData?.image}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* AI Suggestions */}
          {showAiSuggestions && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">AI Generated Suggestions:</h4>
              {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span>Generating suggestions...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {aiSuggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('image', suggestion)}
                      className="w-20 h-20 border border-border rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all duration-200"
                    >
                      <Image
                        src={suggestion}
                        alt={`AI suggestion ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop an image here, or click to browse
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                if (file) {
                  // Mock file upload - replace with actual upload logic
                  const mockUrl = `https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop`;
                  handleInputChange('image', mockUrl);
                }
              }}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="outline" size="sm" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </DialogOverlaySystem>
  );
};

export default ProductFormModal;