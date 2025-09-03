import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DialogOverlaySystem from '../../../components/ui/DialogOverlaySystem';

const OrderDetailsModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onUpdateStatus, 
  onDeleteOrder 
}) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      ready: 'bg-success/10 text-success border-success/20',
      completed: 'bg-muted text-muted-foreground border-border',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'Clock',
      confirmed: 'CheckCircle',
      ready: 'Package',
      completed: 'Check',
      cancelled: 'X'
    };
    return icons?.[status] || 'Clock';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'ready',
      ready: 'completed'
    };
    return statusFlow?.[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      pending: 'Confirm Order',
      confirmed: 'Mark Ready',
      ready: 'Mark Completed'
    };
    return labels?.[currentStatus];
  };

  const handleStatusUpdate = (newStatus) => {
    onUpdateStatus?.(order?.id, newStatus);
    onClose?.();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      onDeleteOrder?.(order?.id);
      onClose?.();
    }
  };

  return (
    <DialogOverlaySystem
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order?.orderId}`}
      description={`Placed on ${formatDate(order?.orderDate)}`}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Order Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(order?.status)}`}>
              <Icon name={getStatusIcon(order?.status)} size={16} />
              {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
            </span>
            <div className="text-sm text-muted-foreground">
              Current Status
            </div>
          </div>
          
          {getNextStatus(order?.status) && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleStatusUpdate(getNextStatus(order?.status))}
              iconName="ArrowRight"
              iconPosition="right"
            >
              {getNextStatusLabel(order?.status)}
            </Button>
          )}
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {order?.customerName}
                  </div>
                  <div className="text-xs text-muted-foreground">Full Name</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {order?.customerEmail}
                  </div>
                  <div className="text-xs text-muted-foreground">Email Address</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {order?.customerPhone}
                  </div>
                  <div className="text-xs text-muted-foreground">Phone Number</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order Total</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(order?.total)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Items Count</span>
                <span className="text-sm font-medium text-foreground">
                  {order?.items?.length} item{order?.items?.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order Date</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(order.orderDate)?.toLocaleDateString('en-US')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pickup Method</span>
                <span className="text-sm font-medium text-foreground">
                  Store Pickup
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
          
          <div className="space-y-3">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-background rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item?.image || '/assets/images/no_image.png'}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {item?.name}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {item?.category}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {item?.quantity} × {formatCurrency(item?.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(item?.price * item?.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Notes */}
        {order?.notes && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Order Notes</h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">{order?.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-border">
          <Button
            variant="destructive"
            onClick={handleDelete}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Order
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            
            {order?.status !== 'completed' && order?.status !== 'cancelled' && (
              <Button
                variant="default"
                onClick={() => {
                  const nextStatus = getNextStatus(order?.status);
                  if (nextStatus) {
                    handleStatusUpdate(nextStatus);
                  }
                }}
                iconName="ArrowRight"
                iconPosition="right"
              >
                {getNextStatusLabel(order?.status) || 'Update Status'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-background border-t pt-4 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {order?.status === 'pending' && (
          <Button onClick={() => onUpdateStatus(order.id, 'confirmed')}>
            Confirm Order
          </Button>
        )}
        <Button variant="destructive" onClick={() => onDeleteOrder(order.id)}>
          Delete Order
        </Button>
      </div>
    </DialogOverlaySystem>
  );
};

export default OrderDetailsModal;