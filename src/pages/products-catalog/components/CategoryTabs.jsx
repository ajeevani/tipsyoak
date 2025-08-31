import React from 'react';
import Button from '../../../components/ui/Button';

const CategoryTabs = ({ activeCategory, onCategoryChange, categories }) => {
  return (
    <div className="bg-background border-b border-border sticky top-16 z-10">
      <div className="w-full px-4 lg:px-6">
        <div className="flex space-x-1 py-4">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={activeCategory === category?.id ? "default" : "ghost"}
              onClick={() => onCategoryChange(category?.id)}
              className="flex-1 sm:flex-none"
            >
              {category?.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;