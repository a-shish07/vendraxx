import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const AddressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
  addressLine2: { type: String, default: '', trim: true, maxlength: 200 },
  landmark: { type: String, default: '', trim: true, maxlength: 120 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  state: { type: String, required: true, trim: true, maxlength: 100 },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  country: { type: String, default: 'India', trim: true, maxlength: 80 },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true })

AddressSchema.index({ userId: 1, isDefault: 1 })
export type AddressDocument = InferSchemaType<typeof AddressSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.Address || mongoose.model('Address', AddressSchema)
