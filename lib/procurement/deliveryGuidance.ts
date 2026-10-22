const africanDestinations = new Set([
  'algeria',
  'angola',
  'benin',
  'botswana',
  'burkina faso',
  'burundi',
  'cabo verde',
  'cape verde',
  'cameroon',
  'central african republic',
  'chad',
  'comoros',
  'congo',
  'republic of the congo',
  'congo republic',
  'democratic republic of the congo',
  'dr congo',
  'drc',
  'congo kinshasa',
  'cote divoire',
  'ivory coast',
  'djibouti',
  'egypt',
  'equatorial guinea',
  'eritrea',
  'eswatini',
  'swaziland',
  'ethiopia',
  'gabon',
  'gambia',
  'the gambia',
  'ghana',
  'guinea',
  'guinea bissau',
  'kenya',
  'lesotho',
  'liberia',
  'libya',
  'madagascar',
  'malawi',
  'mali',
  'mauritania',
  'mauritius',
  'morocco',
  'mozambique',
  'namibia',
  'niger',
  'rwanda',
  'sao tome and principe',
  'senegal',
  'seychelles',
  'sierra leone',
  'somalia',
  'south africa',
  'south sudan',
  'sudan',
  'tanzania',
  'togo',
  'tunisia',
  'uganda',
  'zambia',
  'zimbabwe',
  'reunion',
  'mayotte',
  'western sahara',
]);

export function deliveryGuidance(countryName?: string | null, partner = false) {
  const country = (countryName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  const address =
    'Please provide your exact delivery address and phone number(s).';
  if (partner)
    return {
      title: 'Delivery through your business',
      address,
      message:
        'Your business arranges final delivery or collection with you. Procurement goods are shipped to the business receiving address, not directly to this customer address.',
    };
  if (!country)
    return {
      title: 'Delivery details',
      address,
      message:
        'Select a destination country to see how your order will be delivered.',
    };
  if (['nigeria', 'ng', 'nga'].includes(country))
    return {
      title: 'Pickup or forwarding in Nigeria',
      address,
      message:
        'Your order arrives at our Lagos office for pickup or local forwarding to your address.',
    };
  if (africanDestinations.has(country))
    return {
      title: `Delivery to ${countryName}`,
      address,
      message:
        'Our shipping partners deliver your order directly to your address.',
    };
  if (
    [
      'united kingdom',
      'uk',
      'great britain',
      'gb',
      'england',
      'scotland',
      'wales',
      'northern ireland',
    ].includes(country)
  )
    return {
      title: 'Delivery to the UK',
      address: `${address} Include your postcode.`,
      message:
        'Your order is delivered to your address by a partner such as DHL, UPS, Royal Mail or DPD.',
    };
  if (
    [
      'united states',
      'united states of america',
      'usa',
      'us',
      'canada',
      'ca',
    ].includes(country)
  )
    return {
      title: ['canada', 'ca'].includes(country)
        ? 'Delivery to Canada'
        : 'Delivery to the US',
      address: `${address} Include your ${['canada', 'ca'].includes(country) ? 'postal' : 'ZIP'} code.`,
      message:
        'Your order is delivered to your address by a courier partner such as DHL or UPS.',
    };
  return {
    title: `Delivery to ${countryName}`,
    address: `${address} Include your postal code, where applicable.`,
    message:
      'Our international courier partners deliver your order to your address. The delivery partner depends on your destination and shipping method.',
  };
}
