import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  sku: { type: String, default: '' },
}, { _id: false })

const StatusHistorySchema = new Schema({
  status: { type: String, required: true },
  note: { type: String, default: '' },
  at: { type: Date, default: Date.now },
  changedBy: { type: String, default: '' },
}, { _id: false })

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD', required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'COD'], default: 'PENDING' },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'], default: 'PENDING', index: true },
  customer: {
    name: String, phone: String, email: String,
    address: String, city: String, state: String, pincode: String, notes: String,
  },
  cancellationReason: { type: String, default: '' },
  cancelledBy: { type: String, default: '' },
  cancelledAt: { type: Date },
  statusHistory: { type: [StatusHistorySchema], default: [] },
}, { timestamps: true })

OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ userId: 1, createdAt: -1 })

export type OrderDocument = InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
