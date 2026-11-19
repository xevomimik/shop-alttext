import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ShopAltText - AI-Powered Alt Text for Shopify',
  description:
    'Automatically generate SEO-optimized alt text for your Shopify product images using AI.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Alt Text for <span className="text-blue-600">Shopify</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Automatically generate SEO-optimized, accessible alt text for every product image.
              Save hours of manual work and improve your store's search rankings.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Free
              </Link>
              <Link
                href="#features"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why ShopAltText?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="AI-Generated"
              description="State-of-the-art vision models analyze your product images and write descriptive, accurate alt text."
            />
            <FeatureCard
              icon="🔍"
              title="SEO Optimized"
              description="Alt text includes relevant keywords naturally, helping your products rank higher in search results."
            />
            <FeatureCard
              icon="♿"
              title="Accessibility First"
              description="Make your store accessible to visually impaired customers with proper alt text on every image."
            />
            <FeatureCard
              icon="⚡"
              title="Automatic Sync"
              description="Connect your Shopify store once. New products get alt text automatically via webhooks."
            />
            <FeatureCard
              icon="💰"
              title="Usage-Based Pricing"
              description="Pay only for what you use. Free tier included. No monthly minimums."
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Private"
              description="Your images and data stay encrypted. We never train on your product photos."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Connect Shopify"
              description="Install the ShopAltText app from the Shopify App Store and grant permission to read your products."
            />
            <StepCard
              number="2"
              title="Auto-Scan Images"
              description="We automatically detect products missing alt text and queue them for AI processing."
            />
            <StepCard
              number="3"
              title="Generate & Publish"
              description="AI writes alt text, you review (or auto-approve), and we push it back to Shopify instantly."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Automate Your Alt Text?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of Shopify merchants saving hours every week. Free tier includes 100
            generations/month.
          </p>
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ShopAltText</h3>
              <p className="text-sm">AI-powered alt text generation for Shopify stores.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2024 ShopAltText. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center relative">
      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
