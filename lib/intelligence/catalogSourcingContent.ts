export type CatalogSourcingContent = {
  heading: string;
  summary: string;
  buyingNote: string;
  checks: [string, string, string];
};

// These notes help buyers prepare a China sourcing enquiry. Catalog prices are
// supplier references, and no listing is presented as confirmed stock.
export const catalogSourcingContent: Record<string, CatalogSourcingContent> = {
  'futura-premium-wigs': {
    heading: 'Import Futura wigs from China',
    summary:
      'Use this free catalog to identify a photographed Futura wig style before asking Sure Imports to source it from China for delivery to Nigeria. A JY style code is more useful than a general photo because the same silhouette can have different lengths, colours and lace choices.',
    buyingNote:
      'Ask for the exact fibre, lace construction and finished length to be confirmed against your chosen JY code. A supplier image alone cannot tell you which combination will be supplied.',
    checks: [
      'Quote the JY style code and the number of pieces you want.',
      'Specify colour, length and whether you want 13 × 4 or 13 × 6 lace.',
      'Confirm the selected variant, availability and delivered Nigeria price before payment.',
    ],
  },
  'phone-cases': {
    heading: 'Source phone cases from China',
    summary:
      'This catalog groups decorative case designs for buyers importing phone accessories from China. A design may be listed for several handset models, but that does not make every model or colour available at the same supplier quantity.',
    buyingNote:
      'Build your order by exact handset model, finish and quantity per design. Check whether the quoted construction is TPU, PC or a combination, especially for cases with epoxy, chains or holders.',
    checks: [
      'List each phone model and the quantity needed for that model.',
      'Identify the catalog design, material, colour and any attached accessory.',
      'Confirm the minimum order and packaging for each variant.',
    ],
  },
  'charging-cables': {
    heading: 'Import charging cables from China',
    summary:
      'Use the cable catalog to compare China supplier listings by connector and stated charging power. Cables that look similar can serve different devices, support different data functions or be sold with different packaging.',
    buyingNote:
      'Decide whether you need charging only or charging and data transfer. Match the connector at both ends and the required power rating to the devices your customers will use.',
    checks: [
      'Name both connector ends, cable length and required power rating.',
      'Ask whether the chosen cable supports data transfer as well as charging.',
      'Confirm the unit pack, quantity and exact supplier variant.',
    ],
  },
  'screen-protectors': {
    heading: 'Source screen protectors from China',
    summary:
      'This focused PDF helps Nigeria buyers compare China supplier glass and protective film listings. Screen shape, cut-outs and packaging vary by device, so a generic phone family name is too broad for a sourcing request.',
    buyingNote:
      'Use the exact device model and protector type when requesting a quote. Ask whether the supplier unit includes an installation kit, retail packaging or only the film.',
    checks: [
      'Provide the exact phone or tablet model and its generation.',
      'Choose the protector type and any edge or privacy finish required.',
      'Confirm pack contents, model fit and minimum quantity.',
    ],
  },
  'car-chargers': {
    heading: 'Import car chargers from China',
    summary:
      'Compare China supplier car chargers by the ports and outputs that buyers will actually use. A USB-A and USB-C combination is different from a charger with an attached cable, even if the exterior design is similar.',
    buyingNote:
      'Check the stated output for each port and whether those figures apply when multiple devices charge together. The catalog is a starting point for a specification check, not a performance guarantee.',
    checks: [
      'Choose the port layout or attached cable ends required.',
      'Request the stated output and package contents for the exact model.',
      'Confirm colour, quantity and delivered quote before ordering.',
    ],
  },
  'wall-chargers': {
    heading: 'Source wall chargers from China',
    summary:
      'Use these China supplier adapter listings to compare plug formats, port combinations and stated power. For Nigeria, the plug type and what is included in the box matter as much as the wattage printed on a product image.',
    buyingNote:
      'Tell us the destination and devices to be charged so the supplier can confirm the correct plug, input rating, output and cable bundle. Ask for the exact model rather than assuming all listed variants share one specification.',
    checks: [
      'Specify plug type, ports and the charging power needed.',
      'Check whether a cable is included or quoted separately.',
      'Confirm the adapter label, package and minimum quantity.',
    ],
  },
  'earphones-headphones': {
    heading: 'Import earphones and headphones from China',
    summary:
      'The catalog separates wired and wireless listening products from a mixed China supplier quotation. Connection type, battery details and included accessories determine whether a model fits your market.',
    buyingNote:
      'For wireless models, request the exact battery and charging specification. For wired models, identify the connector. Compare package contents rather than relying only on product photos.',
    checks: [
      'Choose the wired or wireless model and required connector.',
      'Confirm battery, charging case and accessories where applicable.',
      'State the colour mix and quantity for the supplier check.',
    ],
  },
  'phone-holders': {
    heading: 'Source phone holders from China',
    summary:
      'These RMB-priced China supplier listings cover magnetic and suction-style stands for phones and tablets. The mounting surface, device size and whether a magnetic plate is included affect what you should source.',
    buyingNote:
      'Describe how the holder will be used: desk, dashboard or another surface. Ask the supplier to confirm the mounting method and device fit for the selected model.',
    checks: [
      'Identify the device size and intended mounting surface.',
      'Check whether any magnetic plate or adhesive is included.',
      'Confirm finish, pack contents and quantity.',
    ],
  },
  'portable-speakers': {
    heading: 'Import portable speakers from China',
    summary:
      'Use this catalog to shortlist compact wireless speakers from China by model and features. Decorative lighting appears on some listings, while battery and output specifications can differ between designs.',
    buyingNote:
      'Request the exact model specification before choosing for resale or events. A visual match does not establish playing time, charging connector or what comes in the box.',
    checks: [
      'Pick a model and state whether lighting is required.',
      'Check battery, charging connector and stated speaker output.',
      'Confirm colour assortment, packaging and order quantity.',
    ],
  },
  microphones: {
    heading: 'Source microphones from China',
    summary:
      'Compare clip-on and wireless microphone models in this China supplier catalog. The receiver connector and recording device are decisive: a microphone advertised for phones may not fit every phone or camera.',
    buyingNote:
      'Name the device and connector before requesting a quote. For wireless kits, ask how many transmitters and receivers are included and how the components charge.',
    checks: [
      'Specify the recording device, model and connector.',
      'Confirm the number of microphones, receivers and included cables.',
      'Check power, package and quantity for the selected kit.',
    ],
  },
  'wireless-chargers': {
    heading: 'Import wireless chargers from China',
    summary:
      'The China supplier catalog includes magnetic and multi-device charging designs. A stand that shows a phone, watch and earbuds does not necessarily support every brand or include the wall adapter needed for full output.',
    buyingNote:
      'List the exact devices to be charged together. Confirm the supported charging standard, supplied cable and required input adapter for the model you select.',
    checks: [
      'Name the phone, watch and earbud models that must be supported.',
      'Check each charging position and its stated output.',
      'Confirm included cable, adapter requirements and quantity.',
    ],
  },
  'smart-watches': {
    heading: 'Source smart watches from China',
    summary:
      'Use this wearable catalog to compare China supplier models by case, strap and listed functions. Watch faces can look alike while display, app support and phone compatibility differ.',
    buyingNote:
      'Choose by a specific model and ask for its supported phone operating systems and app, rather than treating the pictured watch as a complete specification.',
    checks: [
      'State the watch model, case size, colour and strap choice.',
      'Confirm the companion app and phone compatibility.',
      'Ask what charger, strap and retail packaging are included.',
    ],
  },
  'phone-carry-accessories': {
    heading: 'Import phone straps and lanyards from China',
    summary:
      'This China supplier catalog brings together phone lanyards, straps and card-carry pieces. They are low-cost accessories, but material, attachment method and colour assortment can change the usable order.',
    buyingNote:
      'Decide whether the accessory attaches to a case insert, a dedicated case loop or another fitting. Check the included parts and minimum quantities for each colour.',
    checks: [
      'Identify the attachment method and intended phone case.',
      'Choose material, colour and any card-carry feature.',
      'Confirm included fittings and quantity by colour.',
    ],
  },
  'stylus-pens': {
    heading: 'Source stylus pens from China',
    summary:
      'Compare capacitive and tablet-oriented pens from a China supplier. The iPad-oriented listing has specific compatibility notes; appearance alone will not show whether it supports your customer’s tablet.',
    buyingNote:
      'Give the full tablet model and year. Ask how the pen charges, whether replacement tips are included and which functions are supported for that device.',
    checks: [
      'Provide the exact tablet model, generation and year.',
      'Confirm charging method, stated working time and tip options.',
      'Check the package, colour and required order quantity.',
    ],
  },
  'wifi-routers': {
    heading: 'Import Wi-Fi routers from China',
    summary:
      'This catalog shows China supplier router listings with band, antenna and network features. A dual-band label alone does not settle whether a router works with your internet connection or covers the intended space.',
    buyingNote:
      'Describe the upstream connection, ports and use case. Ask for the precise model specification, power adapter and supported operating modes before ordering.',
    checks: [
      'Specify your internet source and required Ethernet ports.',
      'Check supported bands, modes and power adapter.',
      'Confirm model, plug type and package contents.',
    ],
  },
  'security-cameras': {
    heading: 'Source Wi-Fi security cameras from China',
    summary:
      'The focused PDF contains a China supplier listing for the SMS-ZB66 smart camera. Motion detection and two-way voice are described in the quotation, but installation depends on the app, storage and power requirements of the exact unit.',
    buyingNote:
      'Tell us whether the camera is for indoor or sheltered use and what Wi-Fi and power are available. Request current app and storage details before deciding it fits the location.',
    checks: [
      'Confirm the installation setting and available power.',
      'Ask which app, Wi-Fi band and storage options the model supports.',
      'Check included mount, adapter and order quantity.',
    ],
  },
  'mini-projectors': {
    heading: 'Import nebula light projectors from China',
    summary:
      'This China supplier page is for the SMS-ZB67 astronaut nebula light: a decorative room-light projector. It should not be confused with a video projector, which has a different purpose and specification.',
    buyingNote:
      'Choose this item for its room-light effect and colour modes. Ask about the control method, power supply and included accessories so the delivered item matches the intended use.',
    checks: [
      'Confirm that you want a decorative light rather than a video projector.',
      'Check colour modes, controls and power requirements.',
      'Confirm package contents, colour and quantity.',
    ],
  },
  'bluetooth-trackers': {
    heading: 'Source Bluetooth trackers from China',
    summary:
      'The catalog isolates a China supplier anti-loss tracker listing. Its stated Bluetooth range is a product reference, while everyday use depends on phone compatibility, app setup and battery arrangement.',
    buyingNote:
      'Decide whether the tracker is for keys, a bag or another item, then verify the supported phone app and alert behaviour of the exact model.',
    checks: [
      'State the phone operating system and intended use.',
      'Confirm app, battery type and replacement arrangement.',
      'Check buzzer, package contents and minimum quantity.',
    ],
  },
  'game-controllers': {
    heading: 'Import game controllers from China',
    summary:
      'Use this China supplier catalog to compare mobile and handheld controller layouts. Device fit and platform support matter more than a photo of the grips; connection and power also vary by model.',
    buyingNote:
      'Provide the phone or game platform and the games you need to support. Ask whether a cable, receiver or battery is included for the selected controller.',
    checks: [
      'Name the platform, phone size and preferred connection method.',
      'Confirm supported controls, battery and lighting options.',
      'Check package, colour and quantity by model.',
    ],
  },
  'computer-mice': {
    heading: 'Source computer mice from China',
    summary:
      'Compare wired and wireless mouse listings from the China supplier quotation. Shape and stated DPI may look appealing, but the connection method and receiver or charging parts determine day-to-day compatibility.',
    buyingNote:
      'Tell us the computer or tablet it will connect to and whether you want a cable, USB receiver or Bluetooth connection. Ask for the exact mouse model and its included accessories.',
    checks: [
      'Choose wired, receiver-based or Bluetooth connection.',
      'Confirm DPI options, power method and handedness if relevant.',
      'Check receiver, cable, colour and order quantity.',
    ],
  },
  'gaming-keyboards': {
    heading: 'Import gaming keyboards from China',
    summary:
      'This focused China supplier PDF shows the SMS-GM01 illuminated keyboard with a 104-key layout and lighting modes. Check the actual key layout and connection before sourcing for Nigerian buyers.',
    buyingNote:
      'A 104-key count does not identify every printed key position. Ask for the exact layout, connection, dimensions and package contents before confirming an order.',
    checks: [
      'Confirm the key layout and connection type.',
      'Check lighting controls and power or cable arrangement.',
      'Ask for colour, packaging and minimum quantity.',
    ],
  },
  'mini-fans': {
    heading: 'Source mini fans from China',
    summary:
      'Browse handheld and desk fan designs from a China supplier. The way the fan stands, charges and travels can matter more than its shape when choosing a model for retail or personal use.',
    buyingNote:
      'Choose the format first, then ask for the battery and charging specification of the exact listing. Check whether a stand or cable is part of the unit.',
    checks: [
      'Specify handheld, desk or combined use.',
      'Confirm battery, charging connector and any stand.',
      'Check colour mix, unit packaging and quantity.',
    ],
  },
  'desk-lamps': {
    heading: 'Import desk lamps from China',
    summary:
      'This catalog collects compact desk and night lights from China supplier pages. Decorative and task lights serve different purposes, and the listed models vary in power, charging and shape.',
    buyingNote:
      'Describe where the lamp will be used and whether portable battery power is needed. Confirm the exact model’s light settings and what cable or adapter comes with it.',
    checks: [
      'Choose task lighting or decorative night lighting.',
      'Confirm power, charging and stated light modes.',
      'Check size, colour, package and minimum quantity.',
    ],
  },
  'watch-bands': {
    heading: 'Source watch bands from China',
    summary:
      'Compare replacement watch straps from China by connector, case size and material. A band may resemble another design while using a different fitting, so exact watch compatibility is the first sourcing check.',
    buyingNote:
      'Send the watch model and case size, then choose the band material and colour. Ask for the fitting and order quantity to be verified for that combination.',
    checks: [
      'Name the watch model, case size and connector style.',
      'Choose band material, colour and preferred length.',
      'Confirm fit, packaging and quantity per variant.',
    ],
  },
};
