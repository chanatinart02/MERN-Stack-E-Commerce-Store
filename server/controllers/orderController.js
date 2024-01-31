import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Utility function to calculate the total price of an order
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// User @POST /api/orders/
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
    }

    // Extract just the product IDs from orderItems
    const productIds = orderItems.map((item) => item._id);

    // Retrieving products from the database based on the extracted product IDs
    const itemsFromDB = await Product.find({ _id: { $in: productIds } });

    // Map each order item received from the client
    const dbOrderItems = orderItems.map((itemFromClient) => {
      // Find the matching item from the database
      const matchingItemFromDB = itemsFromDB.find((itemFromDB) => {
        // Compare the database item's ID (converted to string) to the client item's ID
        return itemFromDB._id.toString() === itemFromClient._id;
      });

      if (!matchingItemFromDB) {
        res
          .status(400)
          .json({ message: `Product not found: ${itemFromClient._id}` });
      }

      // Constructing the order item with additional details from the database
      return {
        ...itemFromClient,
        productId: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Creating a new Order instance with the calculated details
    const order = new Order({
      orderItems: dbOrderItems,
      userId: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    // Saving the created order to the database
    const createdOrder = await order.save();
    res.status(200).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin @GET /api/orders/
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "username");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User @GET /api/orders/mine
const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/orders/total-orders
const countTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/orders/total-sales
const calculateTotalSales = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/orders/total-sales-by-date
const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    res.status(200).json(salesByDate);
  } catch (error) {
    const errorMessage = error.message || "Error fetching total sales by date";
    res.status(500).json({ error: errorMessage });
  }
});

//User @GET /api/orders/:id
const findOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "username email"
    );

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    const errorMessage = error.message || "Error fetching order by id";
    res.status(500).json({ error: errorMessage });
  }
});

//User @PUT /api/orders/:id/pay
const markOrderAsPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // Get the payment result from paypal
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Admin @PUT /api/orders/:id/deliver
const markOrderAsDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (!order.isPaid) {
        return res
          .status(400)
          .json({ error: "Order must be paid before it can be delivered" });
      }

      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
