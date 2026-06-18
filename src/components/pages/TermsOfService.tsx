import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing and using our website, you accept and agree to be bound by these Terms of Service',
        'If you do not agree to these terms, please do not use our services',
        'These terms apply to all visitors, users, and customers of LuxeHome',
        'We reserve the right to update these terms at any time without prior notice'
      ]
    },
    {
      title: 'Use of Our Services',
      icon: Shield,
      content: [
        'You must be at least 18 years old to make purchases on our website',
        'You are responsible for maintaining the confidentiality of your account information',
        'You agree to provide accurate and complete information when making purchases',
        'You may not use our services for any illegal or unauthorized purpose',
        'We reserve the right to refuse service to anyone for any reason'
      ]
    },
    {
      title: 'Product Information',
      icon: FileText,
      content: [
        'We strive to display product colors and details as accurately as possible',
        'Actual colors may vary due to monitor settings and lighting conditions',
        'Product dimensions and specifications are provided as accurately as possible',
        'We reserve the right to discontinue products without notice',
        'Custom orders may have different terms and conditions'
      ]
    },
    {
      title: 'Pricing and Payment',
      icon: Scale,
      content: [
        'All prices are listed in USD and are subject to change without notice',
        'Payment is due in full at the time of purchase',
        'We accept major credit cards and other payment methods as displayed',
        'Additional fees may apply for delivery, assembly, or special services',
        'Promotional pricing is subject to terms and conditions'
      ]
    }
  ];

  const prohibitedUses = [
    'Violating any applicable laws or regulations',
    'Transmitting harmful or malicious code',
    'Attempting to gain unauthorized access to our systems',
    'Using our content without permission',
    'Engaging in fraudulent activities',
    'Harassing other users or our staff'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="Terms of Service | LuxeHome"
        description="Review LuxeHome's terms of service for using our website and purchasing furniture."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
            Terms of Service
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair max-w-3xl mx-auto">
            Please read these terms carefully before using our services. These terms govern your use of LuxeHome's website and services.
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
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-montserrat">
                Agreement Overview
              </h2>
              <div className="prose prose-lg text-gray-600 font-playfair">
                <p>
                  These Terms of Service ("Terms") govern your use of the LuxeHome website and services. 
                  By using our website, you agree to comply with and be bound by these Terms.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and LuxeHome. 
                  Please read them carefully and contact us if you have any questions.
                </p>
              </div>
            </div>

            {/* Main Sections */}
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

            {/* Prohibited Uses */}
            <div className="bg-red-50 rounded-3xl p-8 mt-8 border border-red-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-montserrat">
                  Prohibited Uses
                </h3>
              </div>
              <p className="text-gray-600 font-playfair mb-4">
                You may not use our services for any of the following purposes:
              </p>
              <ul className="space-y-2">
                {prohibitedUses.map((use, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 font-playfair">{use}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Terms */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Intellectual Property */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Intellectual Property
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    All content on our website, including text, graphics, logos, and images, is the property of LuxeHome.
                  </p>
                  <p>
                    You may not reproduce, distribute, or create derivative works without our written permission.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Limitation of Liability
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    LuxeHome shall not be liable for any indirect, incidental, or consequential damages.
                  </p>
                  <p>
                    Our total liability shall not exceed the amount paid for the specific product or service.
                  </p>
                </div>
              </div>

              {/* Warranty Disclaimer */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Warranty Disclaimer
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    Our services are provided "as is" without warranties of any kind, express or implied.
                  </p>
                  <p>
                    We do not warrant that our services will be uninterrupted or error-free.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Governing Law
                </h3>
                <div className="text-gray-600 font-playfair space-y-3">
                  <p>
                    These Terms are governed by the laws of the State of New York, United States.
                  </p>
                  <p>
                    Any disputes shall be resolved in the courts of New York County, New York.
                  </p>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Termination
              </h3>
              <div className="text-gray-600 font-playfair space-y-3">
                <p>
                  We may terminate or suspend your account and access to our services immediately, without prior notice, 
                  for any reason, including breach of these Terms.
                </p>
                <p>
                  Upon termination, your right to use our services will cease immediately. All provisions of these Terms 
                  that should survive termination shall survive.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Changes to Terms
              </h3>
              <div className="text-gray-600 font-playfair space-y-3">
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
                  posting on our website.
                </p>
                <p>
                  Your continued use of our services after changes are posted constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 mt-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                Questions About These Terms
              </h3>
              <div className="text-gray-600 font-playfair space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please contact our legal team:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span>legal@luxehome.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Scale className="w-5 h-5 text-amber-600" />
                    <span>Legal Department</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300">
                    Contact Legal Team
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

export default TermsOfService;
