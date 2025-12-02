import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    billNo: { type: String, required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMode: { type: String, enum: ['cash', 'upi', 'card'], default: 'cash' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
