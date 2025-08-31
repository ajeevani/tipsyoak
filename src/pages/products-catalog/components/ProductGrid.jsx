import React from 'react';
import ProductCard from './ProductCard';
import Icon from '../../../components/AppIcon';


const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted skeleton"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded skeleton"></div>
              <div className="h-3 bg-muted rounded skeleton w-3/4"></div>
              <div className="h-8 bg-muted rounded skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Package" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {products?.map((product) => (
        <ProductCard key={product?.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;