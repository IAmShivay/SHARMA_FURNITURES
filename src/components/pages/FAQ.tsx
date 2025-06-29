import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Package, 
  CreditCard, 
  Truck, 
  RotateCcw,
  Settings,
  MessageSquare
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'orders', name: 'Orders & Payment', icon: CreditCard },
    { id: 'shipping', name: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', name: 'Returns & Exchanges', icon: RotateCcw },
    { id: 'products', name: 'Products & Care', icon: Package },
    { id: 'account', name: 'Account & Support', icon: Settings }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You\'ll need to provide shipping information and payment details to complete your purchase.'
    },
    {
      id: '2',
      category: 'orders',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and financing options through Affirm and Klarna.'
    },
    {
      id: '3',
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'Orders can be modified or cancelled within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Please contact customer service immediately if you need to make changes.'
    },
    {
      id: '4',
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days, while white-glove delivery takes 3-5 business days. Express delivery is available in 1-2 business days for an additional fee.'
    },
    {
      id: '5',
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free standard shipping on orders over $500 and free white-glove delivery on orders over $1,000. Express shipping rates vary by location.'
    },
    {
      id: '6',
      category: 'shipping',
      question: 'What is white-glove delivery?',
      answer: 'White-glove delivery includes professional delivery, complete assembly, placement in your desired room, and removal of all packaging materials. Our team will ensure your furniture is set up perfectly.'
    },
    {
      id: '7',
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy from the delivery date. Items must be in original condition with all packaging. We provide free return pickup for most items.'
    },
    {
      id: '8',
      category: 'returns',
      question: 'How do I start a return?',
      answer: 'Log into your account, go to your order history, and select "Return Item" next to the product you want to return. We\'ll guide you through the process and schedule a pickup.'
    },
    {
      id: '9',
      category: 'returns',
      question: 'How long do refunds take?',
      answer: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.'
    },
    {
      id: '10',
      category: 'products',
      question: 'How do I care for my furniture?',
      answer: 'Each piece comes with specific care instructions. Generally, dust regularly with a soft cloth, avoid direct sunlight, and use coasters for drinks. Detailed care guides are available on each product page.'
    },
    {
      id: '11',
      category: 'products',
      question: 'Do you offer custom furniture?',
      answer: 'Yes! We offer custom sizing, finishes, and fabrics for many of our pieces. Contact our design team to discuss your specific requirements and get a custom quote.'
    },
    {
      id: '12',
      category: 'products',
      question: 'What materials do you use?',
      answer: 'We use premium materials including solid hardwoods, high-grade veneers, top-grain leather, and performance fabrics. All materials are sustainably sourced when possible.'
    },
    {
      id: '13',
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the top right corner of our website. You can also create an account during checkout. Having an account allows you to track orders, save favorites, and access exclusive offers.'
    },
    {
      id: '14',
      category: 'account',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also log into your account to view real-time order status and delivery updates.'
    },
    {
      id: '15',
      category: 'account',
      question: 'How do I contact customer service?',
      answer: 'You can reach us via live chat, email at support@luxehome.com, or phone at (555) 123-4567. Our team is available Monday-Friday 9AM-6PM EST.'
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-playfair max-w-3xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none bg-white shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 shadow-md hover:shadow-lg'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search or browse different categories</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 font-montserrat pr-4">
                        {item.question}
                      </h3>
                      <ChevronDown 
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          openItems.includes(item.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {openItems.includes(item.id) && (
                      <div className="px-8 pb-6">
                        <div className="border-t border-gray-200 pt-6">
                          <p className="text-gray-600 font-playfair leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-montserrat">
            Still Need Help?
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-playfair max-w-2xl mx-auto">
            Can't find what you're looking for? Our customer service team is here to help.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">Live Chat</h3>
              <p className="text-gray-600 mb-4 font-playfair">Get instant help from our support team</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200">
                Start Chat
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">Email Support</h3>
              <p className="text-gray-600 mb-4 font-playfair">Send us a detailed message</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200">
                Send Email
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">Call Us</h3>
              <p className="text-gray-600 mb-4 font-playfair">Speak directly with our team</p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200">
                (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
