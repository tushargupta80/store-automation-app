import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grandTotal' },
          orders: { $sum: 1 },
        },
      },
    ]);

    // low stock: stockQty <= lowStockThreshold
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$stockQty', '$lowStockThreshold'] },
    });

    res.json({
      todayRevenue: todaySales[0]?.totalRevenue || 0,
      todayOrders: todaySales[0]?.orders || 0,
      lowStockCount,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
