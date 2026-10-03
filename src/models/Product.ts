import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  sku: { type: String, trim: true, uppercase: true, sparse: true, unique: true },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  imagePublicIds: { type: [String], default: [] },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true })

ProductSchema.index({ subcategory: 1 })
ProductSchema.index({ createdAt: -1 })

export type ProductDocument = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
