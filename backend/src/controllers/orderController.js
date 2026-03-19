import Order from '../models/order.js';
import MenuItem from '../models/menuItem.js';
import Settings from '../models/settings.js';
import User from '../models/Users.js';
import Cart from '../models/Cart.js';
import  { sendOrderConfirmationSMS, sendOrderStatusSMS } from '../services/smsService.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      paystackReference,
    } = req.body;

    // Get settings
    const settings = await Settings.findOne();

    if (!settings?.isAcceptingOrders) {
      return res.status(400).json({ error: 'Restaurant is not accepting orders at the moment' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);

      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ error: `${menuItem?.name || 'Item'} is not available` });
      }

      let itemSubtotal = menuItem.price * item.quantity;

      // Add add-ons price
      if (item.addOns?.length > 0) {
        item.addOns.forEach(addOn => {
          const menuAddOn = menuItem.addOns.find(a => a.name === addOn.name);
          if (menuAddOn) {
            itemSubtotal += menuAddOn.price * item.quantity;
          }
        });
      }

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        addOns: item.addOns || [],
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }

    // Check minimum order
    if (subtotal < settings.delivery.minimumOrder) {
      return res.status(400).json({
        error: `Minimum order amount is GH₵${settings.delivery.minimumOrder}`,
      });
    }

    const deliveryFee = settings.delivery.fee;
    const total = subtotal + deliveryFee;

    // Create order
    const order = new Order({
      customer: req.userId,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      paystackReference,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000), // 40 minutes
    });

    await order.save();

    // Update menu item order counts
    for (const item of orderItems) {
      await MenuItem.findByIdAndUpdate(item.menuItem, {
        $inc: { orderCount: item.quantity },
      });
    }

    // Clear user's cart
    await Cart.deleteOne({ user: req.userId });

    // Send SMS confirmation
    const user = await User.findById(req.userId);
    if (user.phone) {
      await sendOrderConfirmationSMS(user.phone, order.orderNumber);
    }

    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
      },
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get user's orders
export const getMyOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { customer: req.userId };

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('items.menuItem', 'name image')
      .populate('driver', 'name phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is staff
    if (order.customer._id.toString() !== req.userId.toString() && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Rate order
export const rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Can only rate delivered orders' });
    }

    order.rating = rating;
    order.review = review;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error('Rate Order Error:', error);
    res.status(500).json({ error: 'Failed to rate order' });
  }
};

// ===== STAFF ONLY =====

// Get all orders (staff)
export const getAllOrders = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name phone')
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders, count: orders.length });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, driverId } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('customer', 'phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status
    order.status = status;

    // Update timestamps based on status
    const statusTimestamps = {
      confirmed: 'confirmedAt',
      ready: 'readyAt',
      picked_up: 'pickedUpAt',
      delivered: 'deliveredAt',
      cancelled: 'cancelledAt',
    };

    if (statusTimestamps[status]) {
      order[statusTimestamps[status]] = new Date();
    }

    // Assign driver
    if (driverId) {
      order.driver = driverId;
    }

    await order.save();

    // Send SMS notification
    if (order.customer.phone && ['confirmed', 'ready', 'picked_up', 'delivered'].includes(status)) {
      await sendOrderStatusSMS(order.customer.phone, order.orderNumber, status);
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      today: {
        count: await Order.countDocuments({ createdAt: { $gte: today } }),
        revenue: 0,
      },
      thisWeek: {
        count: 0,
        revenue: 0,
      },
      thisMonth: {
        count: 0,
        revenue: 0,
      },
      pending: await Order.countDocuments({ status: 'pending' }),
      preparing: await Order.countDocuments({ status: { $in: ['confirmed', 'preparing', 'ready'] } }),
      inTransit: await Order.countDocuments({ status: { $in: ['picked_up', 'in_transit'] } }),
    };

    // Calculate today's revenue
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: { $ne: 'cancelled' },
    });
    stats.today.revenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get Order Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
