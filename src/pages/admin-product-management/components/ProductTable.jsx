import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { ConfirmDialog } from '../../../components/ui/DialogOverlaySystem';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onBulkAction,
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange
}) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'liquors', label: 'Liquors' },
    { value: 'vapes', label: 'Vapes' },
    { value: 'cigars', label: 'Cigars' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock' },
    { value: 'createdAt', label: 'Date Added' }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products?.map(p => p?.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev?.filter(id => id !== productId));
    }
  };

  const handleDelete = (product) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  const confirmDelete = () => {
    if (deleteConfirm?.product) {
      onDelete(deleteConfirm?.product?.id);
      setDeleteConfirm({ isOpen: false, product: null });
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts?.length > 0) {
      setBulkDeleteConfirm(true);
    }
  };

  const confirmBulkDelete = () => {
    selectedProducts?.forEach(id => onDelete(id));
    setSelectedProducts([]);
    setBulkDeleteConfirm(false);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-destructive' };
    if (stock <= 10) return { label: 'Low Stock', color: 'text-warning' };
    return { label: 'In Stock', color: 'text-success' };
  };

  const getPercentageDisplay = (product) => {
    switch (product?.category) {
      case 'liquors':
        return product?.alcoholPercentage ? `${product?.alcoholPercentage}% ABV` : 'N/A';
      case 'vapes':
        return product?.nicotinePercentage ? `${product?.nicotinePercentage}% Nicotine` : 'N/A';
      case 'cigars':
        return product?.tobaccoPercentage ? `${product?.tobaccoPercentage}% Tobacco` : 'N/A';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="w-full sm:w-80">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
            />
          </div>
          
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            placeholder="Filter by category"
            className="w-full sm:w-48"
          />
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by"
            className="w-full sm:w-40"
          />
        </div>

        {selectedProducts?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedProducts?.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Selected
            </Button>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts?.length === products?.length && products?.length > 0}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                    className="rounded border-border"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Icon name="Package" size={48} className="text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-medium text-foreground">No products found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm || categoryFilter 
                            ? 'Try adjusting your search or filters' :'Get started by adding your first product'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                products?.map((product) => {
                  const stockStatus = getStockStatus(product?.stock);
                  return (
                    <tr key={product?.id} className="hover:bg-muted/30 transition-colors duration-200">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts?.includes(product?.id)}
                          onChange={(e) => handleSelectProduct(product?.id, e?.target?.checked)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product?.image}
                              alt={product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {product?.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              ID: {product?.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground capitalize">
                          {product?.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-foreground">
                          ${product?.price?.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">
                          {product?.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {getPercentageDisplay(product)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            product?.stock === 0 ? 'bg-destructive' :
                            product?.stock <= 10 ? 'bg-warning' : 'bg-success'
                          }`} />
                          <span className={`text-xs font-medium ${stockStatus?.color}`}>
                            {stockStatus?.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(product)}
                            className="h-8 w-8"
                            aria-label="Edit product"
                          >
                            <Icon name="Edit2" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            aria-label="Delete product"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Delete Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm?.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm?.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Multiple Products"
        message={`Are you sure you want to delete ${selectedProducts?.length} selected products? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
      />
    </div>
  );
};

export default ProductTable;