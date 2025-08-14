import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Scale, Users, Globe, CreditCard, RotateCcw, AlertTriangle, Gavel, FileText, MapPin } from "lucide-react";

export default function TermsAndConditions() {
  const definitions = [
    {
      term: "Sure Importers Limited",
      definition: "The company providing product sourcing services as described herein, with offices in Nigeria and China."
    },
    {
      term: "Website",
      definition: "sureimports.com"
    },
    {
      term: "User",
      definition: "Any individual or entity accessing or using Sure Importers Limited's website or services."
    },
    {
      term: "Goods",
      definition: "Products procured by Sure Importers Limited on behalf of its users."
    },
    {
      term: "Special sourcing service",
      definition: "A customized procurement service offered by Sure Importers Limited."
    },
    {
      term: "Commission",
      definition: "The fee charged by Sure Importers Limited for its procurement services."
    }
  ];

  const userObligations = [
    "Provide accurate and up-to-date information during the procurement process.",
    "Abide by all relevant laws and regulations governing international trade and shipping.",
    "Pay all fees and charges associated with the procurement and shipping of goods.",
    "Accept delivery of goods within the specified timeframe."
  ];

  const refundConditions = [
    "Goods purchased under Sure Importers Limited's special sourcing service are eligible for refunds or replacements if they do not meet the specified criteria.",
    "Refunds will be issued if our system overestimates the shipping cost at the time of order placement."
  ];

  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Terms & <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Conditions</span>
            </h1>
            <p className="text-xl text-gray-300">
              Terms and conditions that govern your use of our website and services
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Introduction */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Introduction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              Welcome to Sure Importers Limited's website, sureimports.com. These terms and conditions ("Terms") govern your use of our website and services provided by Sure Importers Limited. By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree to these Terms, please refrain from using our website and services.
            </p>
          </CardContent>
        </Card>

        {/* Definitions */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-blue-400" />
              <span>Definitions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {definitions.map((item, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-2">{item.term}</h4>
                <p className="text-gray-300 text-sm">{item.definition}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scope of Services */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>Scope of Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Sure Importers Limited is a product sourcing company that facilitates the procurement and shipping of products primarily from China. Sure Importers Limited serves individuals and businesses globally.
            </p>
            <p>
              We purchase goods on behalf of our users, who must fully pay for the products. Shipping fees for goods destined for Nigeria and Ghana can be paid upon arrival, while full payment is required for goods shipped from China to other countries.
            </p>
          </CardContent>
        </Card>

        {/* Commission */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>Commission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p>
                Sure Importers Limited charges a commission for every procurement transaction completed on behalf of our users. The commission amount is disclosed prior to the initiation of the procurement process and is non-negotiable.
              </p>
              <p className="mt-3">
                For her special sourcing service, a consolidated quote is provided typically including estimated shipping and clearing costs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Refunds and Replacements */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-blue-400" />
              <span>Refunds and Replacements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Sure Importers Limited will facilitate refunds and/or replacements for procured goods under the following circumstances:
            </p>
            <div className="space-y-3">
              {refundConditions.map((condition, index) => (
                <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-300 text-sm">{condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Obligations */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>User Obligations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {userObligations.map((obligation, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-300 text-sm">{obligation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>Limitation of Liability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                Sure Importers Limited shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of our website or services, including but not limited to procurement errors, shipping delays, or product defects.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law and Dispute Resolution */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Gavel className="w-5 h-5 text-blue-400" />
              <span>Governing Law and Dispute Resolution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Nigeria.
            </p>
            <p>
              Any dispute arising out of or relating to these Terms shall be resolved through arbitration in Nigeria, with each party bearing its own costs.
            </p>
          </CardContent>
        </Card>

        {/* Amendments */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Amendments</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <p>
                Sure Importers Limited reserves the right to amend these Terms at any time without prior notice. Amendments will be effective upon posting on our website. Users are encouraged to review these Terms periodically for updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-gray-300 mb-4">
                If you have any questions or concerns about these Terms, please contact us at{" "}
                <a 
                  href="mailto:hello@sureimports.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  hello@sureimports.com
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Sure Importers Limited Offices:</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <h5 className="text-blue-400 font-semibold mb-2">Nigeria Office</h5>
                  <p className="text-gray-300 text-sm">
                    5 Olutosin Ajayi (Martins Adegbiyega) Street, Ajao Estate, Lagos
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <h5 className="text-blue-400 font-semibold mb-2">China Office</h5>
                  <p className="text-gray-300 text-sm">
                    Guangzhou baiyun area NO.111 airport load jiangfa plaza office NO.3FB3-1
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    广州市白云区机场路111号建发广场3FB3-1
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
          <p className="text-center text-gray-300 text-sm">
            By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}