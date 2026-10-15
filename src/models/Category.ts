import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    subcategories: {
      type: [
        new Schema(
          {
            name: { type: String, required: true, trim: true, maxlength: 100 },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
