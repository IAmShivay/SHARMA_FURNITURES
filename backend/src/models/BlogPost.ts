import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['interior-design', 'furniture-care', 'buying-guides', 'trends', 'diy', 'company-news'],
    },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: Date,
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
BlogPostSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Add id virtual
BlogPostSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

// Indexes
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ title: 'text', content: 'text' });

const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
