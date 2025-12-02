import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Simple bill number generator
const generateBillNo = async () => {
  const count = await Sale.countDocuments();
  return 'BILL-' + String(count + 1).padStart(5, '0');
};

// Create sale
router.post('/', protect, async (req, res) => {
  try {
    const { items, discount = 0, tax = 0, paymentMode = 'cash' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items in sale' });
    }

    let subtotal = 0;
    const processedItems = [];

    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }

      if (product.stockQty < it.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      const lineTotal = product.sellingPrice * it.quantity;
      subtotal += lineTotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: it.quantity,
        price: product.sellingPrice,
        lineTotal,
      });
    }

    const subtotalRounded = Math.round(subtotal * 100) / 100;
    const discountNum = Number(discount) || 0;
    const taxNum = Number(tax) || 0;
    const grandTotal = subtotalRounded - discountNum + taxNum;

    const billNo = await generateBillNo();

    const sale = await Sale.create({
      billNo,
      items: processedItems,
      subtotal: subtotalRounded,
      discount: discountNum,
      tax: taxNum,
      grandTotal,
      paymentMode,
      createdBy: req.user._id,
    });

    // Update stock
    for (const it of items) {
      await Product.findByIdAndUpdate(it.productId, {
        $inc: { stockQty: -it.quantity },
      });
    }

    res.status(201).json(sale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sales
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
