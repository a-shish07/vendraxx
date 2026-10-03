import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, max: 50 },
}, { _id: false })
const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [CartItemSchema], default: [] },
}, { timestamps: true })

export type CartDocument = InferSchemaType<typeof CartSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.Cart || mongoose.model('Cart', CartSchema)
