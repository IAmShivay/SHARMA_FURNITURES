import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Tag, Search, Loader2 } from 'lucide-react';
import { useGetBlogPostsQuery, useGetBlogCategoriesQuery } from '../../store/api/blogApi';
import SEOHead from '../../components/common/SEOHead';

const CATEGORY_LABELS: Record<string, string> = {
  'interior-design': 'Interior Design',
  'furniture-care': 'Furniture Care',
  'buying-guides': 'Buying Guides',
  'trends': 'Trends',
  'diy': 'DIY',
  'company-news': 'Company News',
};

const BlogListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useGetBlogPostsQuery({ page, limit: 9, category: category || undefined, search: search || undefined });
  const { data: categoriesData } = useGetBlogCategoriesQuery();

  const posts = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const categories = categoriesData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead
        title="Blog | LuxeHome"
        description="Design inspiration, furniture care tips, and the latest home decor trends from LuxeHome."
        keywords="furniture blog, interior design tips, home decor trends"
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">Our Blog</h1>
            <p className="text-lg sm:text-xl text-gray-600 font-playfair">
              Design inspiration, furniture care tips, and the latest trends
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setCategory(''); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !category ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setCategory(cat.name); setPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat.name ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {CATEGORY_LABELS[cat.name] || cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h2>
              <p className="text-gray-600">Try a different search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{typeof post.author === 'object' ? post.author.name : ''}</span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.viewCount}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full font-medium transition-colors ${
                    p === pagination.current
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
