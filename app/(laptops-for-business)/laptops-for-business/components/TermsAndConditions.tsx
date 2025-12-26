import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Scale,
  Users,
  Globe,
  CreditCard,
  RotateCcw,
  AlertTriangle,
  Gavel,
  FileText,
  MapPin,
} from 'lucide-react';

export default function TermsAndConditions() {
  const definitions = [
    {
      term: 'Sure Importers Limited',
      definition:
        'The company providing product sourcing services as described herein, with offices in Nigeria and China.',
    },
    {
      term: 'Website',
      definition: 'sureimports.com',
    },
    {
      term: 'User',
      definition:
        "Any individual or entity accessing or using Sure Importers Limited's website or services.",
    },
    {
      term: 'Goods',
      definition:
        'Products procured by Sure Importers Limited on behalf of its users.',
    },
    {
      term: 'Special sourcing service',
      definition:
        'A customized procurement service offered by Sure Importers Limited.',
    },
    {
      term: 'Commission',
      definition:
        'The fee charged by Sure Importers Limited for its procurement services.',
    },
  ];

  const userObligations = [
    'Provide accurate and up-to-date information during the procurement process.',
    'Abide by all relevant laws and regulations governing international trade and shipping.',
    'Pay all fees and charges associated with the procurement and shipping of goods.',
    'Accept delivery of goods within the specified timeframe.',
  ];

  const refundConditions = [
    "Goods purchased under Sure Importers Limited's special sourcing service are eligible for refunds or replacements if they do not meet the specified criteria.",
    'Refunds will be issued if our system overestimates the shipping cost at the time of order placement.',
  ];

  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Terms &{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Terms and conditions that govern your use of our website and
              services
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <FileText className="h-5 w-5 text-blue-400" />
              <span>Introduction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              Welcome to Sure Importers Limited's website, sureimports.com.
              These terms and conditions ("Terms") govern your use of our
              website and services provided by Sure Importers Limited. By
              accessing or using our website and services, you agree to be bound
              by these Terms. If you do not agree to these Terms, please refrain
              from using our website and services.
            </p>
          </CardContent>
        </Card>

        {/* Definitions */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Scale className="h-5 w-5 text-blue-400" />
              <span>Definitions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {definitions.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <h4 className="mb-2 font-semibold text-white">{item.term}</h4>
                <p className="text-sm text-gray-300">{item.definition}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scope of Services */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Globe className="h-5 w-5 text-blue-400" />
              <span>Scope of Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Sure Importers Limited is a product sourcing company that
              facilitates the procurement and shipping of products primarily
              from China. Sure Importers Limited serves individuals and
              businesses globally.
            </p>
            <p>
              We purchase goods on behalf of our users, who must fully pay for
              the products. Shipping fees for goods destined for Nigeria and
              Ghana can be paid upon arrival, while full payment is required for
              goods shipped from China to other countries.
            </p>
          </CardContent>
        </Card>

        {/* Commission */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <CreditCard className="h-5 w-5 text-blue-400" />
              <span>Commission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <p>
                Sure Importers Limited charges a commission for every
                procurement transaction completed on behalf of our users. The
                commission amount is disclosed prior to the initiation of the
                procurement process and is non-negotiable.
              </p>
              <p className="mt-3">
                For her special sourcing service, a consolidated quote is
                provided typically including estimated shipping and clearing
                costs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Refunds and Replacements */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <RotateCcw className="h-5 w-5 text-blue-400" />
              <span>Refunds and Replacements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Sure Importers Limited will facilitate refunds and/or replacements
              for procured goods under the following circumstances:
            </p>
            <div className="space-y-3">
              {refundConditions.map((condition, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-green-500/20 bg-green-500/10 p-4"
                >
                  <div className="flex items-start space-x-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-300">{condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Obligations */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Users className="h-5 w-5 text-blue-400" />
              <span>User Obligations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {userObligations.map((obligation, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
                >
                  <div className="flex items-start space-x-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-300">{obligation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span>Limitation of Liability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-gray-300">
                Sure Importers Limited shall not be liable for any direct,
                indirect, incidental, special, or consequential damages arising
                out of or in any way connected with the use of our website or
                services, including but not limited to procurement errors,
                shipping delays, or product defects.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law and Dispute Resolution */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Gavel className="h-5 w-5 text-blue-400" />
              <span>Governing Law and Dispute Resolution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Nigeria.
            </p>
            <p>
              Any dispute arising out of or relating to these Terms shall be
              resolved through arbitration in Nigeria, with each party bearing
              its own costs.
            </p>
          </CardContent>
        </Card>

        {/* Amendments */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Amendments</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
              <p>
                Sure Importers Limited reserves the right to amend these Terms
                at any time without prior notice. Amendments will be effective
                upon posting on our website. Users are encouraged to review
                these Terms periodically for updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-slate-700/50 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="mb-4 text-gray-300">
                If you have any questions or concerns about these Terms, please
                contact us at{' '}
                <a
                  href="mailto:hello@sureimports.com"
                  className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
                >
                  hello@sureimports.com
                </a>
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">
                Sure Importers Limited Offices:
              </h4>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                  <h5 className="mb-2 font-semibold text-blue-400">
                    Nigeria Office
                  </h5>
                  <p className="text-sm text-gray-300">
                    5 Olutosin Ajayi (Martins Adegbiyega) Street, Ajao Estate,
                    Lagos
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                  <h5 className="mb-2 font-semibold text-blue-400">
                    China Office
                  </h5>
                  <p className="text-sm text-gray-300">
                    Guangzhou baiyun area NO.111 airport load jiangfa plaza
                    office NO.3FB3-1
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    广州市白云区机场路111号建发广场3FB3-1
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
          <p className="text-center text-sm text-gray-300">
            By using our website and services, you acknowledge that you have
            read, understood, and agree to be bound by these Terms and
            Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
