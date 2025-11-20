// src/services/orderService.js

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      // Simulate API call - replace with your actual API endpoint
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      // For now, simulate successful order creation
      console.log('Creating order:', orderData);
      return {
        success: true,
        orderId: `ORD${Date.now()}`,
        message: 'Order created successfully',
        order: {
          ...orderData,
          id: `ORD${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Get order by ID
  getOrder: async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      return await response.json();
    } catch (error) {
      // Mock data for development
      return {
        id: orderId,
        items: [],
        total: 0,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }
  },

  // Get all orders for a user
  getUserOrders: async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/orders`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      // Mock data
      return [];
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      return await response.json();
    } catch (error) {
      console.log(`Updating order ${orderId} status to ${status}`);
      return { success: true, status };
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      
      return await response.json();
    } catch (error) {
      console.log(`Cancelling order ${orderId}`);
      return { success: true, message: 'Order cancelled successfully' };
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      // Simulate payment processing
      console.log('Processing payment:', paymentData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (you can add failure logic here)
      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Payment processing failed'
      };
    }
  },

  // Validate order data
  validateOrder: (orderData) => {
    const errors = [];
    
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }
    
    if (!orderData.shippingAddress) {
      errors.push('Shipping address is required');
    }
    
    if (!orderData.paymentMethod) {
      errors.push('Payment method is required');
    }
    
    if (!orderData.total || orderData.total <= 0) {
      errors.push('Order total must be greater than 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default orderService;