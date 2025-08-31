import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { ConfirmDialog } from '../../../components/ui/DialogOverlaySystem';

const BulkActionsPanel = ({ 
  selectedProducts, 
  onBulkAction, 
  onClearSelection,
  products 
}) => {
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });

  const bulkActionOptions = [
    { value: 'updateCategory', label: 'Update Category' },
    { value: 'updatePrice', label: 'Update Price' },
    { value: 'updateStock', label: 'Update Stock' },
    { value: 'toggleStatus', label: 'Toggle Active Status' },
    { value: 'delete', label: 'Delete Products' }
  ];

  const categoryOptions = [
    { value: 'liquors', label: 'Liquors' },
    { value: 'vapes', label: 'Vapes' },
    { value: 'cigars', label: 'Cigars' }
  ];

  const selectedProductsData = products?.filter(p => selectedProducts?.includes(p?.id));

  const handleBulkAction = () => {
    if (!bulkAction) return;

    const actionData = {
      action: bulkAction,
      productIds: selectedProducts,
      value: bulkValue
    };

    setConfirmDialog({
      isOpen: true,
      action: actionData
    });
  };

  const confirmBulkAction = () => {
    if (confirmDialog?.action) {
      onBulkAction(confirmDialog?.action);
      setBulkAction('');
      setBulkValue('');
      setShowBulkPanel(false);
      onClearSelection();
    }
    setConfirmDialog({ isOpen: false, action: null });
  };

  const getActionDescription = () => {
    switch (bulkAction) {
      case 'updateCategory':
        return `Change category to "${bulkValue}" for ${selectedProducts?.length} products`;
      case 'updatePrice':
        return `Set price to $${bulkValue} for ${selectedProducts?.length} products`;
      case 'updateStock':
        return `Set stock to ${bulkValue} units for ${selectedProducts?.length} products`;
      case 'toggleStatus':
        return `Toggle active status for ${selectedProducts?.length} products`;
      case 'delete':
        return `Delete ${selectedProducts?.length} selected products`;
      default:
        return '';
    }
  };

  const renderValueInput = () => {
    switch (bulkAction) {
      case 'updateCategory':
        return (
          <Select
            options={categoryOptions}
            value={bulkValue}
            onChange={setBulkValue}
            placeholder="Select new category"
            className="w-48"
          />
        );
      case 'updatePrice':
        return (
          <Input
            type="number"
            placeholder="New price"
            value={bulkValue}
            onChange={(e) => setBulkValue(e?.target?.value)}
            min="0"
            step="0.01"
            className="w-32"
          />
        );
      case 'updateStock':
        return (
          <Input
            type="number"
            placeholder="New stock"
            value={bulkValue}
            onChange={(e) => setBulkValue(e?.target?.value)}
            min="0"
            className="w-32"
          />
        );
      case 'toggleStatus': case'delete':
        return null;
      default:
        return null;
    }
  };

  if (selectedProducts?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedProducts?.length} products selected
              </span>
            </div>
            
            {!showBulkPanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkPanel(true)}
                iconName="Settings"
                iconPosition="left"
              >
                Bulk Actions
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>

        {showBulkPanel && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1">
                <Select
                  label="Bulk Action"
                  options={bulkActionOptions}
                  value={bulkAction}
                  onChange={setBulkAction}
                  placeholder="Select action"
                  className="w-full sm:w-48"
                />
              </div>

              {renderValueInput() && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Value
                  </label>
                  {renderValueInput()}
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || (bulkAction !== 'toggleStatus' && bulkAction !== 'delete' && !bulkValue)}
                  variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                  size="sm"
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowBulkPanel(false);
                    setBulkAction('');
                    setBulkValue('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>

            {bulkAction && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Icon name="Info" size={14} className="inline mr-1" />
                  {getActionDescription()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selected Products Preview */}
        {selectedProducts?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Selected Products:</h4>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {selectedProductsData?.slice(0, 10)?.map((product) => (
                <div
                  key={product?.id}
                  className="inline-flex items-center space-x-2 px-2 py-1 bg-accent rounded-md text-xs"
                >
                  <span className="truncate max-w-24">{product?.name}</span>
                  <button
                    onClick={() => onClearSelection([product?.id])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
              {selectedProductsData?.length > 10 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{selectedProductsData?.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog?.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null })}
        onConfirm={confirmBulkAction}
        title="Confirm Bulk Action"
        message={getActionDescription()}
        confirmText="Apply Changes"
        variant={bulkAction === 'delete' ? 'destructive' : 'default'}
      />
    </>
  );
};

export default BulkActionsPanel;