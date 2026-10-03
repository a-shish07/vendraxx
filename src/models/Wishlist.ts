import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const WishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  productIds: { type: [Schema.Types.ObjectId], ref: 'Product', default: [] },
}, { timestamps: true })

export type WishlistDocument = InferSchemaType<typeof WishlistSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema)
