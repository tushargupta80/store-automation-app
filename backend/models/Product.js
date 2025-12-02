import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true },
    category: { type: String },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stockQty: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    unit: { type: String, default: 'pcs' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
