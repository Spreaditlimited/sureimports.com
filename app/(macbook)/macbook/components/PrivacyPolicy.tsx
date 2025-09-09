import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Database, Eye, Share2, Cookie, Link, Baby, User, FileText, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  
  const informationTypes = [
    "Contact information (such as name, email address, phone number)",
    "Billing and shipping address",
    "Payment information",
    "Order details and preferences",
    "Communications and correspondence with us"
  ];


  const informationUses = [
    "To process and fulfill orders for products and services.",
    "To communicate with users regarding their orders, inquiries, or requests.",
    "To provide customer support and assistance.",
    "To improve our website, services, and user experience.",
    "To personalize your experience and tailor our offerings to your preferences.",
    "To send periodic emails and updates regarding our products, services, promotions, or other relevant information."
  ];


  const securityMeasures = [
    "Encryption",
    "Secure socket layer (SSL) technology",
    "Firewalls",
    "Regular security audits"
  ];


  const userRights = [
    "Access your personal information",
    "Update your personal information", 
    "Delete your personal information"
  ];


  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Privacy <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              How we collect, use, and safeguard your personal information
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Introduction */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Our Commitment to Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              We are committed to protecting the privacy and security of our users' personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us when using our website and services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span>Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              We collect personal information from users in various ways, including when you register on our website, place an order, or communicate with us via email or other channels. The types of personal information we may collect include:
            </p>
            
            <div className="grid gap-3">
              {informationTypes.map((type, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-300 text-sm">{type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span>How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              We use the information we collect for the following purposes:
            </p>
            
            <div className="grid gap-3">
              {informationUses.map((use, index) => (
                <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-300 text-sm">{use}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              We implement a variety of security measures to maintain the safety and integrity of your personal information. These measures include:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {securityMeasures.map((measure, index) => (
                <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{measure}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                We restrict access to your personal information to authorized personnel only and ensure that our third-party service providers adhere to strict security standards.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-blue-400" />
              <span>Data Sharing and Disclosure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                <strong>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent</strong>, except as required or permitted by law.
              </p>
            </div>
            
            <p className="text-gray-300">
              We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you, as long as they agree to keep your information confidential.
            </p>
          </CardContent>
        </Card>

        {/* Cookies and Tracking Technologies */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-yellow-400" />
              <span>Cookies and Tracking Technologies</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and gather information about how you interact with our website.
            </p>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                You can choose to disable cookies through your browser settings; however, please note that some features of our website may not function properly if cookies are disabled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Links */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Link className="w-5 h-5 text-blue-400" />
              <span>Third-Party Links</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p>
                Our website may contain links to third-party websites or services that are not operated or controlled by Sure Importers Limited. We are not responsible for the privacy practices or content of these third-party sites and encourage you to review their privacy policies before providing any personal information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Baby className="w-5 h-5 text-purple-400" />
              <span>Children's Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p>
                Our website and services are not intended for children under the age of 18. We do not knowingly collect personal information from children, and if we become aware that we have inadvertently collected information from a child, we will take steps to delete it promptly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Your Rights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              You have the right to access, update, or delete your personal information at any time. Your rights include:
            </p>
            
            <div className="grid gap-3">
              {userRights.map((right, index) => (
                <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{right}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                If you would like to exercise any of these rights or have any questions or concerns about our Privacy Policy, please contact us using the information provided below.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to This Privacy Policy */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Changes to This Privacy Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p>
                We reserve the right to update or revise this Privacy Policy at any time without prior notice. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this Privacy Policy periodically for any updates or changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                If you have any questions, comments, or concerns about our Privacy Policy or our practices regarding your personal information, please contact us at{" "}
                <a 
                  href="mailto:hello@sureimports.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  hello@sureimports.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Agreement */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
          <p className="text-center text-gray-300 text-sm">
            By using our website and services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}