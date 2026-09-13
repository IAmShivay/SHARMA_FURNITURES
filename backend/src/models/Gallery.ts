import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  description: string;
  images: string[];
  type: 'inspiration' | 'project';
  category: string;
  clientName: string;
  location: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    type: {
      type: String,
      required: true,
      enum: ['inspiration', 'project'],
    },
    category: {
      type: String,
      required: true,
      enum: ['living-room', 'bedroom', 'kitchen', 'dining-room', 'office', 'outdoor', 'bathroom', 'other'],
    },
    clientName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

GalleryItemSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

GalleryItemSchema.index({ published: 1, order: 1 });
GalleryItemSchema.index({ type: 1 });
GalleryItemSchema.index({ category: 1 });
GalleryItemSchema.index({ featured: 1 });
GalleryItemSchema.index({ tags: 1 });

const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItem;
