export type VehicleFaq = {
  id: string;
  category: string;
  question: string;
  answer: string[];
  source?: { label: string; href: string };
};

export const vehicleFaqs: VehicleFaq[] = [
  {
    id: 'landed-price',
    category: 'Pricing & payment',
    question: 'What is included in the estimated landed price?',
    answer: [
      'The estimated landed price combines your vehicle price in Naira with estimated shipping from China to Nigeria. The shipping estimate includes clearing, duties and taxes; these are not added a second time.',
      'Every EV we ship to Nigeria comes with a compatible wall-mountable charger. Charger installation is separate from the supplied equipment. All vehicles arrive in Lagos; you arrange collection and onward delivery. Confirm installation, registration and insurance separately.',
    ],
  },
  {
    id: 'naira-pricing',
    category: 'Pricing & payment',
    question: 'Why can the Naira price change before I order?',
    answer: [
      'Vehicle prices are calculated from the supplier’s RMB price using our current Naira conversion rate. Shipping uses our current inclusive CBM rate. Changes in these rates, the supplier price or your chosen configuration can change the website estimate.',
      'Your issued quotation records the agreed amounts and has a validity period. If it expires, ask us to confirm it before making a new transfer.',
    ],
  },
  {
    id: 'cbm',
    category: 'Pricing & payment',
    question: 'How is shipping calculated, and what does CBM mean?',
    answer: [
      'CBM means cubic metres. We calculate the exterior shipping volume as length × width × height in metres, then multiply it by our inclusive Naira rate per CBM. For dimensions supplied in millimetres, divide their product by 1,000,000,000.',
      'For example, a vehicle measuring 5 m × 1.8 m × 2 m occupies 18 CBM. Interior cargo capacity is different: a van with 7 m³ of cargo space can occupy much more than 7 CBM when shipped.',
    ],
  },
  {
    id: 'price-request',
    category: 'Pricing & payment',
    question: 'Why do some configurations say “Price on request”?',
    answer: [
      'We are waiting for a confirmed supplier price or other information needed to calculate that configuration accurately. It does not mean the vehicle is free or unavailable. Submit a request and we can confirm availability, specifications and pricing before you pay.',
    ],
  },
  {
    id: 'bank-payment',
    category: 'Pricing & payment',
    question: 'How do I pay for my vehicle?',
    answer: [
      'Choose a configuration, sign in and submit your request. Once your quotation and invoice are issued, open the order in your dashboard and transfer to one of the company bank accounts shown there. Use the payment reference provided.',
      'Upload a clear bank receipt or transfer confirmation showing the amount and reference. Finance checks the actual payment before approving it. A proof upload alone does not confirm that funds have been received.',
    ],
  },
  {
    id: 'split-transfers',
    category: 'Pricing & payment',
    question: 'Can I pay in separate transfers or use a deposit?',
    answer: [
      'You can submit separate transfers against the same invoice if your bank has a transfer limit. Upload a proof for each transfer and enter its actual amount; your dashboard shows approved payments and the remaining balance.',
      'Where Pay Small Small is available, you can request a payment plan. Your offer shows the minimum deposit, additional fee and payment period before you accept. Pay by bank transfer and submit proof in your dashboard. Only verified credits count toward your balance. Procurement begins only after the entire landed cost and fee are paid and approved; a deposit does not reserve a vehicle.',
    ],
  },
  {
    id: 'payment-review',
    category: 'Pricing & payment',
    question:
      'What if my payment is pending, rejected or sent after the quote expires?',
    answer: [
      'A pending claim is awaiting finance review. If a proof is rejected, read the reason and submit the correct details or contact us with your order reference. Do not send a second payment simply because the first has not yet been approved.',
      'If you already paid against an expired quote, submit the proof through your order for reconciliation and contact us. If you overpaid or transferred the wrong amount, contact the team rather than entering a different amount to make the upload fit.',
    ],
  },
  {
    id: 'choose-model',
    category: 'Choosing a vehicle',
    question: 'How do I choose the right EV for my route or business?',
    answer: [
      'Start with daily distance, typical passenger or cargo load, road conditions, operating hours and where the vehicle will park and charge. For a business, tell us about your busiest day rather than just your average trip.',
      'Compare configurations using battery capacity, supplier-stated range, seating and cargo space. Request confirmation of payload, charging specifications and any equipment essential to your operation before ordering.',
    ],
  },
  {
    id: 'configuration',
    category: 'Choosing a vehicle',
    question: 'Why does one model have several configurations?',
    answer: [
      'The same model may have different battery sizes, seats, body styles or refrigeration equipment. Those choices can affect its price, weight, range and usable space.',
      'Use the configuration picker on the model page or in Compare. The name and specification in your final quotation identify the configuration being ordered; a model name or gallery photo alone is not enough.',
    ],
  },
  {
    id: 'photos',
    category: 'Choosing a vehicle',
    question: 'Will I receive the exact vehicle shown in the photos or videos?',
    answer: [
      'Gallery images and videos illustrate the model range and may show optional equipment, different interiors or other configurations. Confirm colour, seating, body type, battery, steering position and included accessories in writing before payment.',
      'Where a model has a video, it appears on its detail page. Ask about any feature visible in a photo that is important to your purchase.',
    ],
  },
  {
    id: 'stock',
    category: 'Choosing a vehicle',
    question:
      'Are the vehicles already in Nigeria, and can I arrange a viewing?',
    answer: [
      'All vehicles are shipped from China when ordered. We do not hold local stock in Nigeria for viewing or test drives.',
      'Explore the photos, specifications and available videos on each model page. Contact us if you need more information about a configuration before ordering. We confirm supplier availability and the estimated delivery timeline in your quotation.',
    ],
  },
  {
    id: 'other-vehicles',
    category: 'Choosing a vehicle',
    question:
      'Can you help with passenger cars, hybrids or vehicles outside this range?',
    answer: [
      'The initial range focuses on electric commercial vehicles, with space for other vehicle types and powertrains. If your requirement is not listed, contact us with your intended use, preferred specification, quantity and budget. Availability and the scope of sourcing must be confirmed before an order can proceed.',
    ],
  },
  {
    id: 'home-charging',
    category: 'Charging & ownership',
    question: 'Can I charge an electric vehicle at home or at my depot?',
    answer: [
      'Yes. All EVs we supply can be charged using standard Nigerian mains voltage and electricity through the wall-mountable charger (charging pile) included with each vehicle. You can charge at home or at your depot once the charger is properly installed.',
      'Have a qualified installer fit the charger with suitable wiring, earthing and circuit protection for its rated load. For a fleet, plan the number of vehicles charging at once and the hours available overnight. We can provide the supplied charger’s power rating and installation requirements for your configuration.',
    ],
    source: {
      label: 'Further reading: planning home charging',
      href: '/blog/ev-home-charging-nigeria',
    },
  },
  {
    id: 'connector',
    category: 'Charging & ownership',
    question: 'Does my EV come with a charger, and can I use other chargers?',
    answer: [
      'Yes. Each EV comes with its own compatible wall-mountable charger that works with standard Nigerian mains electricity. You do not need to buy a separate charger to get started; arrange proper installation of the included unit.',
      'If you want to use a different charger or a public charging station, confirm compatibility with your exact vehicle first. The connector, charging standard and power limits must match; an adapter does not automatically make every combination compatible.',
    ],
    source: {
      label: 'Further reading: vehicle and charger compatibility',
      href: '/blog/ev-home-charging-nigeria',
    },
  },
  {
    id: 'charging-time',
    category: 'Charging & ownership',
    question: 'How long does charging take?',
    answer: [
      'Charging time with the included wall-mountable charger depends on its power rating, your electrical supply, the vehicle’s charging limits and how much energy you need to add. Battery temperature and the starting charge level also matter; charging can slow as the battery fills. Ask us for the charging specifications for your chosen configuration.',
      'As a rough planning calculation, 30 kWh added at a sustained 7 kW takes about 4.3 hours before allowing for losses or changes in charging speed. This is an illustration, not a charging-time claim for any listed vehicle.',
    ],
    source: {
      label: 'Further reading: charging time and equipment',
      href: '/blog/how-long-to-charge-an-ev-nigeria',
    },
  },
  {
    id: 'charging-cost',
    source: {
      label: 'Actual electricity tariffs and charging costs',
      href: '/blog/ev-charging-cost-nigeria',
    },
    category: 'Charging & ownership',
    question: 'How can I estimate what charging will cost in Naira?',
    answer: [
      'Multiply electricity drawn from the supply in kWh by your actual electricity tariff per kWh. For example, 40 kWh at the published September 2026 IE Ogun Band A Non-MD energy rate of ₦209.50/kWh costs ₦8,380 before separately applied taxes or charges. Your supplier, tariff band and bill may differ.',
      'The wall-mountable charger comes with your EV. Allow for charging losses, installation and any backup-power costs when comparing an EV with a petrol or diesel vehicle. Use your route and load, not only brochure range, to estimate cost per kilometre.',
    ],
  },
  {
    id: 'power-cuts',
    source: {
      label: 'Generator charging: compatibility and costs',
      href: '/blog/charging-ev-with-generator-nigeria',
    },
    category: 'Charging & ownership',
    question: 'What about power cuts, solar or generator charging?',
    answer: [
      'The included wall-mountable charger works with standard Nigerian mains electricity. If you also want to charge during power cuts, tell your installer about your solar system, inverter, battery storage or generator so they can check its capacity for the charger and your charging schedule.',
      'A solar or backup system that powers ordinary household loads may not support vehicle charging at the power you need. Have the installer confirm a suitable connection and supply before using the included charger with backup power.',
    ],
  },
  {
    id: 'real-range',
    category: 'Charging & ownership',
    question: 'Will I get the advertised driving range in Nigeria?',
    answer: [
      'Catalogue ranges are supplier-stated figures, with the test standard shown where it was supplied. They are not a promise of the distance you will achieve on your route.',
      'Load, speed, hills, air conditioning, temperature and driving conditions can change energy use. Plan a reserve and confirm suitability using your actual duty cycle, especially for delivery routes, passenger services and refrigerated vehicles.',
    ],
    source: {
      label: 'Further reading: factors affecting EV range',
      href: '/blog/ev-range-nigeria-real-world-planning',
    },
  },
  {
    id: 'warranty',
    source: {
      label: 'Maintenance, battery and warranty guide',
      href: '/blog/ev-maintenance-battery-warranty-nigeria',
    },
    category: 'Charging & ownership',
    question:
      'What warranty, servicing and spare-parts support will I receive?',
    answer: [
      'These details must be confirmed for your exact configuration before payment. Request written terms for the vehicle, battery and major components, including duration, mileage limits, exclusions and how a claim is handled in Nigeria.',
      'Also confirm who can service the vehicle, access to diagnostic support, parts lead times and who pays for labour or transport. We do not apply an unconfirmed blanket warranty or promise that every part is stocked locally.',
    ],
  },
  {
    id: 'delivery-time',
    category: 'Shipping & tracking',
    question: 'How long will my vehicle take to arrive?',
    answer: [
      'There is no single delivery time for every vehicle. The estimate depends on supplier availability or production, inspection, shipment scheduling, transit and clearance.',
      'Your order can show an estimated arrival date when confirmed by the team. Follow dashboard updates for changes rather than treating a catalogue listing as a guaranteed delivery date.',
    ],
  },
  {
    id: 'tracking',
    category: 'Shipping & tracking',
    question: 'How do I track my order?',
    answer: [
      'Open My vehicle orders in your Sure Imports dashboard. The timeline records payment confirmation, supplier ordering, readiness, inspection, dispatch from China, arrival in Nigeria, clearing and delivery milestones.',
      'These are progress updates entered by our team, not live GPS tracking. Order updates are sent by email; opt in with a valid WhatsApp number to receive WhatsApp updates too.',
    ],
  },
  {
    id: 'inspection',
    category: 'Shipping & tracking',
    question: 'What should be checked before the vehicle leaves China?',
    answer: [
      'Agree the inspection scope before ordering. It should address the configuration you are paying for, vehicle identification, condition, included equipment and any checks or documents essential to your intended use.',
      'Ask which photos, videos or inspection records will be available and whether an independent inspection is required. A general “inspection completed” milestone should not be treated as a promise of a particular certification or test that was never agreed.',
    ],
  },
  {
    id: 'handover',
    category: 'Shipping & tracking',
    question:
      'Does the landed estimate include delivery to my address and registration?',
    answer: [
      'The displayed estimate covers the vehicle and shipping to Lagos, including clearing, duties and taxes. All vehicles arrive in Lagos. You are responsible for collection and any last-mile delivery to your address; it is not included in the landed estimate.',
      'Confirm registration, insurance, road-use documentation and any local delivery requirements before payment. Their inclusion should be explicit; they are not automatically covered by the phrase “landed price”.',
    ],
  },
  {
    id: 'handover-check',
    category: 'Shipping & tracking',
    question: 'What should I check when I receive the vehicle?',
    answer: [
      'Check the vehicle identification and configuration against your order, inspect the condition, and account for the keys, included wall-mountable charger, manuals and documents agreed in the quotation.',
      'Record any visible damage or missing items with clear photos and notify the team promptly with your order reference. Follow the handover process and the agreed terms for recording and resolving discrepancies.',
    ],
  },
  {
    id: 'fleet',
    category: 'Fleet & order support',
    question: 'Can I order several vehicles for a business or transport fleet?',
    answer: [
      'Yes. Select the required quantity for a configuration and describe your operation in the request. For mixed models, share the quantities and specifications for each with the team.',
      'Include routes, daily distance, payload or passenger needs, charging arrangements and your target operating date. Ask us to confirm supply capacity and a practical delivery plan; quantity alone does not guarantee a discount or a single shipment.',
    ],
  },
  {
    id: 'cargo-payload',
    category: 'Fleet & order support',
    question: 'What is the difference between cargo volume and payload?',
    answer: [
      'Cargo volume describes the space available inside the vehicle, usually in cubic metres. Payload describes the permitted load by weight. A large cargo area does not automatically mean the vehicle can carry heavy goods.',
      'For your configuration, confirm payload, gross vehicle weight, loading dimensions and the effect of fitted equipment. Refrigeration units, shelving and passenger conversions can change what the vehicle can carry.',
    ],
  },
  {
    id: 'refrigerated',
    category: 'Fleet & order support',
    question: 'What should I confirm for refrigerated vans or passenger buses?',
    answer: [
      'For a refrigerated vehicle, specify the required temperature, goods carried, trip length, door-opening frequency and whether cooling must continue while parked. Confirm refrigeration performance and its impact on usable space and energy demand.',
      'For passenger transport, confirm seating, seat belts, access, air conditioning and the exact passenger configuration. Do not assume a cargo model can be used as a passenger bus without a separately confirmed specification.',
    ],
  },
  {
    id: 'cancellation',
    category: 'Fleet & order support',
    question: 'Can I change or cancel my order, and what happens to a refund?',
    answer: [
      'Contact us with your order reference before making a change. The options depend on whether payment has been received, the supplier has accepted the order or production or shipping has started.',
      'Ask for the cancellation and refund terms before payment. Do not assume a custom configuration or supplier-confirmed order can be cancelled without cost. A request to cancel is not itself a refund approval.',
    ],
  },
  {
    id: 'contact',
    category: 'Fleet & order support',
    question: 'What information should I send when asking for help?',
    answer: [
      'For a new enquiry, share the model or intended use, preferred configuration, quantity, daily distance and any essential charging or equipment requirements.',
      'For an existing order, include the order reference and a concise description of the issue. Submit payment proofs through your order dashboard. Never send banking passwords, PINs or one-time security codes.',
    ],
  },
];
