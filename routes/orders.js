
const router = require('express').Router();
const { verifyToken, verifyAdmin } = require('../middleware/authenticationMiddleware');
const { Order, User, OrderItem, Product } = require('../models'); 
const twilioClient = require('../config/twilioClient');
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;  //Dont forget his phone number in .env
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;  

let dailySequence = 0;
let lastDate = new Date().toISOString().slice(0, 10);  

function generateOrderNumber() {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== lastDate) {
        dailySequence = 0;  
        lastDate = today;
    }
    dailySequence++;
    const year = new Date().getFullYear().toString().slice(2, 4);  
    const month = String(new Date().getMonth() + 1).padStart(2, '0');  
    const day = String(new Date().getDate()).padStart(2, '0');  
    return `SAR${year}${month}${day}${String(dailySequence).padStart(4, '0')}`;  
}

router.post('/', verifyToken, async (req, res) => {
  const { orderItems, totalAmount, paymentMethod, isCashOnDelivery } = req.body;
  const userId = req.user.id;

  if (!orderItems.every(item => item.productId)) {
      return res.status(400).json({ error: 'Every order item must have a productId' });
  }

  try {
      const orderNumber = generateOrderNumber(); 
      const order = await Order.create({
          userId,
          totalAmount,
          orderNumber,
          paymentMethod,
          status: isCashOnDelivery ? 'Pending Payment' : 'Completed',
          orderStatus: 'In Progress' 
      });

      const items = orderItems.map(item => ({
          ...item,
          orderId: order.id
      }));
      await OrderItem.bulkCreate(items);
 
twilioClient.messages.create({
  body: `New Order Alert! Order ID: ${order.orderNumber} has been created.`,
  to: adminPhoneNumber,  
  from: twilioNumber,  
}).then(message => console.log('Order notification sent:', message.sid))
  .catch(error => console.error('SMS sending failed:', error));
res.status(201).json(order);
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price']
          }]
        }
      ],
      attributes: ['id', 'orderNumber', 'createdAt', 'totalAmount', 'status', 'orderStatus']
    });

    const formattedOrders = orders.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount.toFixed(2),
      status: order.status, 
      orderStatus: order.orderStatus, 
      customerId: order.customer.id,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      products: order.orderItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price.toFixed(2),
        productQuantity: item.quantity
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }],
      attributes: ['id', 'orderNumber', 'createdAt', 'totalAmount', 'status', 'orderStatus'] // Include orderStatus here
    });

    const formattedOrders = orders.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount.toFixed(2),
      status: order.status,
      orderStatus: order.orderStatus, 
      products: order.orderItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price.toFixed(2),
        quantity: item.quantity
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/:orderId/status', verifyToken, verifyAdmin, async (req, res) => {
  const { orderStatus } = req.body; 
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.orderStatus(404).json({ error: 'Order not found' });
    }

    order.orderStatus = orderStatus; 
    await order.save();

    res.json({ message: 'Order status updated successfully', orderStatus: order.orderStatus });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
