import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  slug: { type: String, required: true, unique: true, maxlength: 180 },
  description: { type: String, default: '', maxlength: 10000 },
  shortDescription: { type: String, default: '', maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  sku: { type: String, trim: true, uppercase: true, sparse: true, unique: true },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  imagePublicIds: { type: [String], default: [] },
  category: { type: String, required: true, trim: true, index: true },
  subcategory: { type: String, default: '', trim: true, index: true },
  stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true })

ProductSchema.index({ active: 1, category: 1, subcategory: 1, createdAt: -1 })
ProductSchema.index({ name: 'text', description: 'text', shortDescription: 'text', sku: 'text', tags: 'text' })
ProductSchema.index({ createdAt: -1 })

export type ProductDocument = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
