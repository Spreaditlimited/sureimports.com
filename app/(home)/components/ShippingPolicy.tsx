'use client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Truck, Plane, Ship, Zap, MapPin, Clock, AlertCircle } from "lucide-react";

export default function ShippingPolicy() {
  const shippingMethods = [
    {
      icon: Plane,
      title: "Normal Air Cargo",
      description: "Suitable for goods without batteries, liquids, or gas.",
      details: ["Shipping via: Cargo planes", "Estimated delivery time: Within 7 business days to most countries"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Plane,
      title: "Special Air Cargo (via Hong Kong)",
      description: "Suitable for goods containing batteries, liquids, or gas.",
      details: ["Shipping via: Cargo planes through Hong Kong", "Estimated delivery time: 3 to 4 weeks"],
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Ship,
      title: "Sea Shipping",
      description: "Suitable for bulky goods.",
      details: ["Shipping Options: Full container load or groupage", "Estimated delivery time: 60 to 90 days"],
      color: "from-green-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Express Shipping",
      description: "Suitable for certain goods that can be carried via passenger airlines. E.g. phones and laptops.",
      details: ["Primary destinations: Nigeria and many African countries", "Estimated delivery time: Within 5 business days"],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Truck,
      title: "Partner Shipping (DHL, UPS, FedEx, Royal Mail)",
      description: "Suitable for shipments to Europe, USA, Australia, and other non-African countries.",
      details: ["Services: End-to-end shipping or last-mile delivery", "Note: This includes South Africa for phone shipments"],
      color: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <div className="bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Shipping <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              Comprehensive shipping information for Sure Imports services
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Company Information */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Sure Importers Limited is a product sourcing company registered in Nigeria with an operational office in Guangzhou, China.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Nigeria Office:</h4>
                <p className="text-sm">
                  Sure Importers Limited<br />
                  5 Olutosin Ajayi (Martins Adegboyega) Street,<br />
                  Ajao Estate Lagos, Nigeria
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">China Office:</h4>
                <p className="text-sm">
                  Guangzhou baiyun area NO.111 airport load jiangfa plaza office NO.3FB3-1<br />
                  广州市白云区机场路111号建发广场3FB3-1
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Website:</h4>
              <a href="https://www.sureimports.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                www.sureimports.com
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Methods */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-400" />
              <span>Shipping Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Sure Importers Limited offers various shipping methods to accommodate different types of goods and customer needs:
            </p>
            <div className="space-y-6">
              {shippingMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2">{method.title}</h4>
                        <p className="text-gray-300 mb-3">{method.description}</p>
                        <ul className="space-y-1">
                          {method.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-gray-400 text-sm flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Procedures */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Shipping Procedures for USA, UK, Europe, Australia, and South Africa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-4 text-sm text-gray-400">(Phones only)</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Order confirmation and consolidation</li>
              <li>Packaging for shipping</li>
              <li>Determination of volumetric weight and pricing</li>
              <li>Payment by customer</li>
              <li>Remittance to shipping partners</li>
              <li>Shipment to Hong Kong</li>
              <li>Creation of shipping label (including tracking number)</li>
              <li>Customs clearance</li>
              <li>Handover to shipping partners</li>
            </ol>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span>Important Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="space-y-2 list-disc list-inside">
                <li>Shipping label generation takes 2-3 BUSINESS days after payment</li>
                <li>Tracking information becomes available only after our partners receive the shipment</li>
                <li>Initial tracking may show that partners have not yet taken possession of the shipment</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">For Sea Shipping USA, UK, Europe, Australia, and South Africa (Phones only)</h4>
              <p>The time between shipping label generation and visible tracking movement can take 25 to 35 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment and Tracking */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Payment and Tracking for USA, UK, Europe, Australia, and South Africa</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-4 text-sm text-gray-400">(Phones only)</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Customers will be provided with a quote based on the volumetric weight of their shipment</li>
              <li>Full payment is required before shipping commences</li>
              <li>A tracking number will be provided once the shipping label is generated</li>
              <li>Customers can track their shipments using the provided tracking number on our partners' websites</li>
            </ol>
          </CardContent>
        </Card>

        {/* Online Store Shipping */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Shipping of Gadgets from Sureimports.com Online Store</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Items ordered on the sureimports.com online store have a shipping timeline of 10 business days from order to arrival at our Lagos office. We have the same timeline for gadgets going to Ghana and Cameroon and other countries where we are able to ship gadgets to.
            </p>
            <p>
              For last mile delivery in Nigeria, we partner with local delivery companies in Nigeria and they determine how fast you will receive your gadget. You also have the option of picking up your gadget from our office.
            </p>
          </CardContent>
        </Card>

        {/* Customer Support */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Customer Support</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              For any questions or concerns regarding your shipment, please contact our customer support team through our website{" "}
              <a href="https://www.sureimports.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                www.sureimports.com
              </a>{" "}
              or via the contact information provided for our office locations.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-white/5 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              Shipping times are estimates and may vary due to factors beyond our control, such as customs procedures, weather conditions, or unforeseen logistical issues. Sure Importers Limited will make every effort to ensure timely delivery but cannot guarantee specific delivery dates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}