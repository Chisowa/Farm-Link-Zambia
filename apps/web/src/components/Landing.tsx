import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-2xl font-bold text-green-700">Farm-Link Zambia</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="text-gray-700 hover:text-green-600">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600">
              About
            </a>
            <a href="#cta" className="text-gray-700 hover:text-green-600">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Smart Agricultural Advisory for Zambian Farmers
            </h1>
            <p className="text-xl text-gray-600">
              Get AI-powered crop advice, pest management strategies, and weather insights tailored
              to your farm's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-md">
                Get Started Free
              </button>
              <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg rounded-md">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative h-96 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <span className="text-7xl">☁️</span>
                <p className="text-gray-700 font-semibold">AI-Powered Advisory System</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to make better farming decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Advisory Card */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="text-3xl">💬</span>
                <CardTitle>AI-Powered Advisory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ask your farming questions and get instant, contextual advice based on
                  agricultural research from ZARI and the Ministry of Agriculture.
                </p>
              </CardContent>
            </Card>

            {/* Crop Information Card */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="text-3xl">🌿</span>
                <CardTitle>Crop Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access detailed information about optimal growing conditions, planting seasons,
                  and recommended varieties for your region.
                </p>
              </CardContent>
            </Card>

            {/* Weather Monitoring Card */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="text-3xl">☁️</span>
                <CardTitle>Weather Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get accurate weather data and forecasts for your location to plan planting,
                  spraying, and harvesting activities.
                </p>
              </CardContent>
            </Card>

            {/* Pest Management Card */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="text-3xl">⚠️</span>
                <CardTitle>Pest & Disease Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify pests and diseases affecting your crops with integrated management
                  strategies and treatment recommendations.
                </p>
              </CardContent>
            </Card>

            {/* Market Prices Card */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="text-3xl">📈</span>
                <CardTitle>Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track commodity prices and market trends to know the best time to sell your crops
                  at maximum profit.
                </p>
              </CardContent>
            </Card>

            {/* Location-Based Advice Card */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="text-3xl">📍</span>
                <CardTitle>Location-Specific Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive personalized recommendations tailored to your specific location, soil
                  type, and local climate patterns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Empowering Zambian Agriculture</h2>
              <p className="text-lg text-gray-600">
                Farm-Link Zambia leverages cutting-edge AI and extensive agricultural knowledge to
                provide farmers with actionable insights.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-xl">👥</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Community-Focused</h3>
                    <p className="text-gray-600">
                      Built for smallholder farmers and agricultural communities
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data-Driven</h3>
                    <p className="text-gray-600">
                      Powered by verified agricultural research and ZARI data
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-xl">🌱</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sustainable</h3>
                    <p className="text-gray-600">
                      Promoting sustainable farming practices and resource management
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-3xl text-green-600">1000+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Farmers using the platform</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-3xl text-blue-600">50+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Crop varieties supported</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-3xl text-green-600">24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">AI advisory available</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-3xl text-blue-600">10+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Languages supported</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Farming?</h2>
          <p className="text-xl text-green-50 mb-8">
            Join thousands of Zambian farmers who are already using Farm-Link to increase yields and
            reduce losses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold rounded-md">
              Get Started Now
            </button>
            <button className="border border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-md">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
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
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
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
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Farm-Link Zambia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
