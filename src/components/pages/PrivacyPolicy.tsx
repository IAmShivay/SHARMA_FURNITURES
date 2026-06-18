import React from 'react';
import { Shield, Eye, Lock, Users, Globe, Mail } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Users,
      content: [
        'Personal information you provide when creating an account or making a purchase',
        'Contact information including name, email address, phone number, and shipping address',
        'Payment information processed securely through our payment partners',
        'Usage data and preferences to improve your shopping experience',
        'Device information and IP address for security and analytics purposes'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'Process and fulfill your orders and provide customer service',
        'Send you important updates about your orders and account',
        'Personalize your shopping experience and product recommendations',
        'Improve our website, products, and services',
        'Comply with legal obligations and protect against fraud'
      ]
    },
    {
      title: 'Information Sharing',
      icon: Globe,
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted service providers who help us operate our business',
        'Information may be disclosed if required by law or to protect our rights',
        'Anonymous, aggregated data may be used for research and analytics',
        'With your consent, we may share information for marketing purposes'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'We use industry-standard encryption to protect your data',
        'Secure servers and firewalls protect against unauthorized access',
        'Regular security audits and updates to maintain protection',
        'Limited access to personal information on a need-to-know basis',
        'Secure payment processing through PCI-compliant partners'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="Privacy Policy | LuxeHome"
        description="Read LuxeHome's privacy policy to understand how we collect, use, and protect your personal information."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="text-sm text-gray-500">
            Last updated: January 1, 2024
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-montserrat">
                Our Commitment to Privacy
              </h2>
              <div className="prose prose-lg text-gray-600 font-playfair">
                <p>
                  At LuxeHome, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                  website or make a purchase from us.
                </p>
                <p>
                  By using our services, you agree to the collection and use of information in accordance with this policy. 
                  We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
              </div>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-lg p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 font-montserrat">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 font-playfair">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Cookies */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Cookies & Tracking
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.
                  </p>
                  <p>
                    You can control cookie settings through your browser preferences. However, disabling cookies may affect website functionality.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Your Rights
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    You have the right to access, update, or delete your personal information at any time.
                  </p>
                  <p>
                    You may also opt out of marketing communications and request data portability where applicable.
                  </p>
                </div>
              </div>

              {/* Data Retention */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Data Retention
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    We retain your personal information only as long as necessary to provide our services and comply with legal obligations.
                  </p>
                  <p>
                    Account information is retained until you request deletion or close your account.
                  </p>
                </div>
              </div>

              {/* International Transfers */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  International Transfers
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    Your information may be transferred to and processed in countries other than your own.
                  </p>
                  <p>
                    We ensure appropriate safeguards are in place to protect your data during international transfers.
                  </p>
                </div>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 mt-8 border border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Children's Privacy
              </h3>
              <div className="text-gray-600 font-playfair space-y-3">
                <p>
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                  information from children under 13.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information, 
                  please contact us immediately.
                </p>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Changes to This Policy
              </h3>
              <div className="text-gray-600 font-playfair space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically for any changes. Changes to this 
                  Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 mt-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Contact Us About Privacy
              </h3>
              <div className="text-gray-600 font-playfair space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <span>privacy@luxehome.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span>Data Protection Officer</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300">
                    Contact Privacy Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
