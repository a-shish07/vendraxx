import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true })

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId }
export default mongoose.models.User || mongoose.model('User', UserSchema)
