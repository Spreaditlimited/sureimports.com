import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Smartphone, Laptop, Shield, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function WarrantyPolicy() {
  const phoneWarrantyFeatures = [
    { title: "12 months warranty", description: "From delivery date" },
    { title: "Motherboard coverage", description: "Internal components protected" },
    { title: "Quality assurance", description: "Brand new and pre-owned devices" }
  ];

  const laptopWarrantyFeatures = [
    { title: "3-12 months warranty", description: "3 months pre-owned, 12 months new" },
    { title: "Motherboard coverage", description: "Internal processor-related issues" },
    { title: "Professional support", description: "Expert technical assistance" }
  ];

  const fayaProducts = [
    { name: "FAYA Charging Cable", warranty: "12 months" },
    { name: "FAYA Charger", warranty: "12 months" },
    { name: "FAYA Power banks", warranty: "12 months" },
    { name: "FAYA Phone", warranty: "12 months" }
  ];

  const phoneExclusions = [
    "Screen damage (cracks, dead pixels, discoloration, touch malfunctions)",
    "Water or liquid damage",
    "Battery degradation due to age or misuse",
    "Physical damage, including dents, broken buttons, charging port damage, or audio issues caused by mishandling",
    "Software or operating system issues caused by third-party apps or modifications"
  ];

  const laptopExclusions = [
    "Screen damage or flickering",
    "Keyboard and trackpad issues caused by spills or physical wear",
    "Hinge breakage or casing cracks",
    "Battery or charger-related issues",
    "Any software-related problems, including viruses or corrupted files"
  ];

  const voidConditions = [
    "Evidence of physical damage or tampering",
    "Exposure to moisture or water",
    "Use of non-original chargers or accessories",
    "Repairs carried out by unauthorized technicians",
    "Rooting, jailbreaking, or altering the device's operating system"
  ];

  const notCovered = [
    "Products without sufficient proof of purchase",
    "Lost or stolen products",
    "Items that have expired their warranty period",
    "Non quality-related issues",
    "Free products",
    "Repairs through 3rd parties",
    "Damage from outside sources",
    "Damage from misuse of products (including, but not limited to: falls, extreme temperatures, water, operating devices improperly)"
  ];

  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Warranty <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              Quality assurance and protection for all Sure Imports products
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
              <span>Phone & Laptops Warranty Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              At Sure Imports, we stand by the quality of the devices we ship — whether brand new or pre-owned. 
              We are committed to ensuring our customers enjoy peace of mind with every purchase.
            </p>
          </CardContent>
        </Card>

        {/* Phones and Tablets Warranty */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span>Phones and Tablets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
              {phoneWarrantyFeatures.map((feature, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Coverage */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Coverage</span>
              </h4>
              <p className="text-gray-300">Motherboard and internal components</p>
            </div>

            {/* Exclusions */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Exclusions</span>
              </h4>
              <ul className="space-y-2">
                {phoneExclusions.map((exclusion, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {exclusion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Laptops Warranty */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-blue-400" />
              <span>Laptops (Brand New and Pre-owned Only)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
              {laptopWarrantyFeatures.map((feature, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Coverage */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Coverage</span>
              </h4>
              <p className="text-gray-300">Motherboard and internal processor-related issues</p>
            </div>

            {/* Exclusions */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Exclusions</span>
              </h4>
              <ul className="space-y-2">
                {laptopExclusions.map((exclusion, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {exclusion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Void Conditions */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>Warranty Becomes Void Under These Conditions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {voidConditions.map((condition, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  {condition}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Warranty Claims Process */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Warranty Claims Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <ol className="space-y-3 list-decimal list-inside text-gray-300">
                <li>
                  Contact our support team via WhatsApp or email -{" "}
                  <a href="mailto:hello@sureimports.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    hello@sureimports.com
                  </a>{" "}
                  with your order number and a clear explanation of the issue.
                </li>
                <li>
                  If the issue falls within warranty coverage, we will guide you on how to either return the device for inspection and replacement or send a replacement of the faulty part. You will bear the cost of installation if we send the faulty part replacement. You will also bear the cost to and from our Lagos office.
                </li>
                <li>
                  After verification, we will either:
                  <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                    <li>Repair the device at no cost, or</li>
                    <li>Offer a replacement (if repair is not feasible), or</li>
                    <li>Refund the value (in rare cases where replacement or repair isn't possible)</li>
                  </ul>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Note on Screens */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Note on Screens and External Damage</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p>
                Screens are not covered under warranty due to their fragile nature and vulnerability to damage from drops, pressure, or spills. Similarly, any external parts damaged by user mishandling are not covered. We encourage all customers to use protective cases and handle devices with care.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAYA Warranty Policy */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">FAYA Warranty Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              Sure Importers Limited provides a straightforward warranty for all FAYA products that is processed in the most hassle-free way possible. Please refer to the Warranty Timeline section below for the warranty timelines of various products, as warranty periods may differ according to products.
            </p>
            <p className="text-gray-400 text-sm">
              This limited warranty provided by the manufacturer in no way affects a potential statutory warranty provided by law.
            </p>

            {/* FAYA Product Timelines */}
            <div>
              <h4 className="text-white font-semibold mb-4">Warranty Timelines</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {fayaProducts.map((product, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-gray-300">{product.name}</span>
                    <span className="text-blue-400 font-semibold">{product.warranty}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAYA Warranty Claims */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Warranty Claims for Quality-Related Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              All quality-related defects on items sold directly by Sure Importers Limited or Sure Importers Limited's authorized resellers are covered by an extensive warranty, starting from the date of purchase.
            </p>
            <p>
              Quality-related warranty claims on purchases made through Sure Importers Limited's authorized distributors and retailers are handled through Sure Importers Limited.
            </p>
            <p>
              For quality-related warranty claims, items will be replaced with a factory refurbished model of equal value when available, otherwise a new item will be sent. In situations where a replacement is not an available or preferred option, Sure Importers Limited will offer a partial refund according to the usage time of the device.
            </p>
            <p>
              Warranties on all replacements follow the same warranty timeframe of the original defective item. Warranties on products are void after having been fully refunded.
            </p>
          </CardContent>
        </Card>

        {/* Warranty Claim Process */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Warranty Claim Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Requirements:</h4>
              <ol className="space-y-2 list-decimal list-inside text-gray-300">
                <li>Buyer must provide sufficient proof of purchase</li>
                <li>Sure Importers must document what happens when buyers troubleshoot the product</li>
                <li>The defective item's serial number and/or visible proof depicting the defect are required</li>
                <li>It may be necessary to return an item for quality inspection</li>
                <li>For defective items that Sure Importers needs to have returned, warranties on those replacements are voided if the wrong item is returned to Sure Importers or if the defective item is not returned</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-semibold">Valid Proof of Purchase:</h4>
              <ul className="space-y-2 list-disc list-inside text-gray-300 ml-4">
                <li>Order number from online purchases made through Sure Importers or Sure Importers' authorized dealers</li>
                <li>Sales invoice</li>
                <li>Dated sales receipt from an authorized Sure Importers dealer that shows a description of the product along with its price</li>
              </ul>
              <p className="text-gray-400 text-sm">
                Please note that more than one type of proof of purchase may be required to process a warranty claim (such as receipt of money transfer and confirmation of address item was originally shipped to).
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-gray-300">
                <strong>Important:</strong> Warranty claims for product defects expire 90 days after opening a warranty claim. It is not possible to process a warranty claim for items that have expired their original warranty timeframe or 90-day warranty claim request period, whichever is longer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Costs */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Delivery Costs (Buyer Responsibility)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Delivery cost must be covered by buyer in the following situations:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-300 ml-4">
              <li>Returning products for any reason other than a proven defect</li>
              <li>Warranty claims on items taken outside the original country of purchase</li>
              <li>Buyer's accidental returns</li>
              <li>Returning personal items</li>
              <li>Returning items claimed to have defects but found by Sure Importers' quality control to be in working condition</li>
              <li>Returning defective items in international shipping</li>
              <li>Costs associated with unauthorized returns (any returns made outside of the approved warranty process)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Not Covered */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>Not Covered Under Warranty</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notCovered.map((item, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}