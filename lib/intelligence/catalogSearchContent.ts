export type CatalogSearchContent = {
  intro: string;
  inside: [string, string, string];
  choosing: string;
};

// Specifics are drawn from the supplier PDFs. These are catalog descriptions,
// not claims that an individual variant is currently available or priced for delivery.
export const catalogSearchContent: Record<string, CatalogSearchContent> = {
  'futura-premium-wigs': {
    intro:
      'Browse photographed lace frontal wigs made with Japanese Futura fibre. The catalog identifies each style with a JY code so you can ask about the exact look rather than sending an approximate reference photo.',
    inside: [
      '150 photographed JY styles',
      'Length and colour options to discuss',
      '13 × 4 and 13 × 6 lace choices',
    ],
    choosing:
      'Send the JY code, preferred length, colour and lace size. We will confirm the available combination and your final delivered price before payment.',
  },
  'phone-cases': {
    intro:
      'Compare decorative phone cases from the supplier quotation, including TPU and PC constructions with printed, epoxy, chain and holder details. Model compatibility and colour are central to choosing the right listing.',
    inside: [
      'Decorative case designs',
      'Phone model compatibility lists',
      'Supplier pack and minimum-order details',
    ],
    choosing:
      'Share the case design, phone model and colour. The supplier lists minimum quantities for many designs, so ask us to confirm the applicable quantity before ordering.',
  },
  'charging-cables': {
    intro:
      'Browse charging and data cable listings with connector variants and stated power options. The quotation includes USB-C, iPhone-compatible and other cable configurations rather than one universal cable.',
    inside: [
      'Connector and cable variants',
      'Power ratings listed by model',
      'RMB reference prices by option',
    ],
    choosing:
      'Specify the connector on each end, required charging power and quantity. We will check the exact variant and compatibility before quoting.',
  },
  'screen-protectors': {
    intro:
      'Review the supplier’s screen protector and film options with packaging and model information. The original quotation mixes product prices with other currency references; this edition keeps RMB price entries only.',
    inside: [
      'Glass and protective film listings',
      'Packaging and model information',
      'RMB unit price references',
    ],
    choosing:
      'Tell us the device model, protector type and quantity. We will check fit, packaging and the current supplier minimum before giving a delivered quote.',
  },
  'car-chargers': {
    intro:
      'Compare in-car charging accessories by port layout, connector and stated output. The supplier lists several fast-charging configurations, including USB and USB-C options.',
    inside: [
      'Car charger models',
      'Port and cable combinations',
      'Stated output and colour options',
    ],
    choosing:
      'Send the model or catalog page and tell us which ports or cable ends you need. We will verify the variant and its current specification.',
  },
  'wall-chargers': {
    intro:
      'Explore wall and travel charger adapters with different outputs, port combinations and plug options. Some listings bundle a cable while others describe the adapter separately.',
    inside: [
      'Wall adapter models',
      'Plug and port variations',
      'Cable bundle options',
    ],
    choosing:
      'Identify the plug type, port configuration and device you intend to charge. We will confirm the exact package and electrical specification before payment.',
  },
  'earphones-headphones': {
    intro:
      'Compare the supplier’s wired and wireless listening products. Individual listings include connection, battery, colour or audio specifications that matter more than the product photo alone.',
    inside: [
      'Earphone and headphone models',
      'Connection and battery details',
      'Colour and package variants',
    ],
    choosing:
      'Send the model and say whether you need wired or wireless audio. We will confirm the specification, accessories and quantity available.',
  },
  'phone-holders': {
    intro:
      'See the phone and tablet stand listings that include RMB prices in the source quotation. These are magnetic and suction-based holder designs, not a general phone accessory price list.',
    inside: [
      'Magnetic stand designs',
      'Device fit information',
      'RMB priced supplier listings',
    ],
    choosing:
      'Tell us the device size and where the stand will be used. We will check the mounting method, fit and current price.',
  },
  'portable-speakers': {
    intro:
      'Browse compact wireless speakers from the supplier quotation, including models with decorative lighting. Listings provide details such as power, battery or connection where supplied.',
    inside: [
      'Portable speaker models',
      'Wireless and lighting features',
      'Supplier specification sheets',
    ],
    choosing:
      'Share the model and the features that matter to you, such as battery life, output or lighting. We will confirm the exact specification.',
  },
  microphones: {
    intro:
      'Compare the microphone listings extracted from the mixed accessory pages. The selection includes wireless and clip-on recording options with connector or noise-reduction details.',
    inside: [
      'Clip-on and wireless microphones',
      'Connector options',
      'Recording specification details',
    ],
    choosing:
      'Tell us the phone or camera you will use and the connector it needs. We will check compatibility and the included receiver or accessories.',
  },
  'wireless-chargers': {
    intro:
      'Browse magnetic and multi-device wireless charging products. The supplier quotation distinguishes phone, earphone and watch charging outputs across different designs.',
    inside: [
      'Magnetic charging models',
      'Multi-device designs',
      'Input and output specifications',
    ],
    choosing:
      'Name the devices you want to charge together and share the catalog model. We will confirm compatibility, supplied cable and adapter requirements.',
  },
  'smart-watches': {
    intro:
      'Review wearable listings with watch dimensions, strap information and feature specifications. The supplier’s models differ in hardware and appearance, so the exact model matters.',
    inside: [
      'Smart watch models',
      'Case and strap specifications',
      'Listed hardware features',
    ],
    choosing:
      'Share the watch model, preferred colour and the phone it will pair with. We will confirm compatibility and the available variant.',
  },
  'phone-carry-accessories': {
    intro:
      'Find phone lanyards, straps and card-carry accessories in one focused catalog. The listings vary in attachment method, material and colour.',
    inside: [
      'Phone lanyards and straps',
      'Card-carry accessories',
      'Colour and attachment options',
    ],
    choosing:
      'Send the item and colour you prefer, along with your phone case type. We will check how it attaches and the applicable minimum quantity.',
  },
  'stylus-pens': {
    intro:
      'Compare the capacitive pen listings, including an iPad-oriented model with stated compatibility and charging details. Check device support before choosing by appearance.',
    inside: [
      'Capacitive pen models',
      'Device compatibility notes',
      'Charging and working-time details',
    ],
    choosing:
      'Tell us your exact tablet model and year. We will verify that the selected stylus supports it and confirm what is included.',
  },
  'wifi-routers': {
    intro:
      'Review the dual-band wireless router listings with antenna and network specifications. One listed model states 2.4 GHz and 5.8 GHz operation and a range-extension mode.',
    inside: [
      'Wireless router models',
      'Band and antenna information',
      'Network feature descriptions',
    ],
    choosing:
      'Describe your internet connection, coverage area and required ports. We will confirm that the chosen router fits that setup.',
  },
  'security-cameras': {
    intro:
      'Inspect the Wi-Fi smart camera listing with motion detection, panoramic monitoring and two-way voice features as described by the supplier. This catalog contains the RMB-priced camera entry from the source.',
    inside: [
      'SMS-ZB66 Wi-Fi camera listing',
      'Motion detection and two-way voice details',
      'RMB price for the listed camera',
    ],
    choosing:
      'Tell us where you intend to install it and what connectivity you have. We will confirm power, app and storage requirements before quoting.',
  },
  'mini-projectors': {
    intro:
      'See the astronaut-style nebula projector listing extracted from the source quotation. It is a decorative light projector with colour modes, rather than a screen projector for video.',
    inside: [
      'SMS-ZB67 astronaut nebula projector',
      'Controllable colour modes',
      'Supplier specification and RMB price',
    ],
    choosing:
      'Tell us the room and power setup you have in mind. We will confirm the exact package, control method and electrical requirements.',
  },
  'bluetooth-trackers': {
    intro:
      'Review the compact anti-loss tracker listing with its stated Bluetooth distance and buzzer specification. The catalog contains the RMB-priced tracker entry from the mixed accessory pages.',
    inside: [
      'SMS-SM25 anti-loss tracker',
      'Stated 50-metre Bluetooth distance',
      'Buzzer and device details',
    ],
    choosing:
      'Tell us which phone you use and what you want to track. We will confirm app compatibility, battery arrangement and current availability.',
  },
  'game-controllers': {
    intro:
      'Compare mobile and handheld game controller options with different grips, controls and connection methods. The supplier lists model-specific features such as vibration and lighting.',
    inside: [
      'Game controller models',
      'Phone-fit and connection details',
      'Control and lighting features',
    ],
    choosing:
      'Share the game device, phone size and model you prefer. We will check platform support and whether a battery or cable is included.',
  },
  'computer-mice': {
    intro:
      'Browse computer mouse listings and a related desk accessory from the supplier’s mixed pages. The mice vary in connection method, shape and stated sensitivity.',
    inside: [
      'Computer mouse models',
      'Connection and DPI details',
      'Related desk accessory listing',
    ],
    choosing:
      'Tell us whether you need wireless or wired input and which device it will connect to. We will confirm the receiver, charging method and variant.',
  },
  'gaming-keyboards': {
    intro:
      'Inspect the illuminated gaming keyboard listing with its key count and lighting modes. This focused PDF keeps the supplier’s RMB price and specification together.',
    inside: [
      'SMS-GM01 gaming keyboard',
      '104-key layout and nine lighting modes',
      'RMB price for the listed keyboard',
    ],
    choosing:
      'Tell us the keyboard layout and connection you need. We will confirm those details and the available colour before ordering.',
  },
  'mini-fans': {
    intro:
      'Compare small handheld and desk fan designs from the supplier quotation. The listings include different stands, charging arrangements and portable formats.',
    inside: [
      'Portable mini fan models',
      'Stand and power details',
      'Colour or design variations',
    ],
    choosing:
      'Share the fan model and whether you need handheld or desk use. We will confirm battery, charging and current variant availability.',
  },
  'desk-lamps': {
    intro:
      'Browse compact desk and night lighting products, including rechargeable decorative styles. The supplier entries show different shapes, power details and colours.',
    inside: [
      'Desk and night light models',
      'Power and charging information',
      'Colour and design choices',
    ],
    choosing:
      'Tell us whether the lamp is for task lighting or decoration and identify the model. We will confirm brightness, power and package details.',
  },
  'watch-bands': {
    intro:
      'Compare replacement watch straps in different materials and styles. Size and connector compatibility matter, so the catalog should be used with your exact watch model.',
    inside: [
      'Watch band styles',
      'Material and colour options',
      'Size and fit information',
    ],
    choosing:
      'Send the watch model, case size and preferred band material. We will confirm fit and the available colour before quoting.',
  },
};
