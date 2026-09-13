import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import { useGetBlogPostQuery } from '../../store/api/blogApi';
import SEOHead from '../../components/common/SEOHead';

const CATEGORY_LABELS: Record<string, string> = {
  'interior-design': 'Interior Design',
  'furniture-care': 'Furniture Care',
  'buying-guides': 'Buying Guides',
  'trends': 'Trends',
  'diy': 'DIY',
  'company-news': 'Company News',
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useGetBlogPostQuery(slug || '', { skip: !slug });

  const post = data?.data?.post;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="text-amber-600 hover:text-amber-700 font-medium">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const authorName = typeof post.author === 'object' ? post.author.name : '';

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead
        title={`${post.title} | LuxeHome Blog`}
        description={post.excerpt}
        keywords={post.tags ? post.tags.join(', ') : ''}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage,
          author: {
            '@type': 'Person',
            name: authorName
          },
          datePublished: post.publishedAt,
          publisher: {
            '@type': 'Organization',
            name: 'LuxeHome'
          }
        }}
      />
      {/* Hero */}
      <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="container mx-auto max-w-4xl">
            <span className="bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mt-4 mb-4 font-montserrat">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-white/80 text-sm">
              {authorName && <span>By {authorName}</span>}
              {post.publishedAt && (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              )}
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.viewCount} views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article body */}
          <article
            className="prose prose-lg max-w-none prose-headings:font-montserrat prose-headings:text-gray-900 prose-a:text-amber-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
              Inspired by this article?
            </h3>
            <p className="text-gray-600 mb-6">
              Browse our collection of premium furniture to bring these ideas to life.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
