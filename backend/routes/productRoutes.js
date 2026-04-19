import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/', protect, async (req, res) => {
  try {
    const { name, sku, category, costPrice, sellingPrice, stockQty, lowStockThreshold, unit } = req.body;

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    const product = await Product.create({
      name,
      sku,
      category,
      costPrice,
      sellingPrice,
      stockQty: stockQty || 0,
      lowStockThreshold: lowStockThreshold || 5,
      unit: unit || 'pcs',
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, sku, category, costPrice, sellingPrice, stockQty, lowStockThreshold, unit, isActive } = req.body;

    // Check if SKU already exists for another product
    if (sku) {
      const existingProduct = await Product.findOne({ sku, _id: { $ne: req.params.id } });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        sku,
        category,
        costPrice,
        sellingPrice,
        stockQty,
        lowStockThreshold,
        unit,
        isActive,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (soft delete by setting isActive to false)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;