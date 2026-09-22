const hub = 'https://www.sureimports.com/import-from-china-to-uk';
const calculator = 'https://linescout.sureimports.com/amazon-profit-calculator';
const marker = 'uk-content-batch-four';
export const plans = [
  {
    slug: 'the-profit-blueprint-how-to-turn-your-landed-cost-into-a-confident-selling-price',
    anchor:
      '<h2><strong>Part 1: The "Floor" — Understanding Landed Cost per Unit</strong></h2>',
    corrections: [
      [
        'In Nigeria, a "healthy" margin typically ranges between 30% and 50% depending on the industry. This tool doesn\'t just add a markup; it calculates a price that ensures that even after all costs are paid, your target percentage remains as <strong>pure profit</strong>.',
        'Choose a target margin based on your costs and what customers will pay. The tool calculates a price from the costs and percentage fee you enter; it does not include every possible business expense or guarantee net profit.',
      ],
      [
        "If you are selling online via platforms like Paystack, Flutterwave, or Jumia, they charge a transaction fee (usually between 1.5% and 2.5%). The Retail Price Builder accounts for this so you don't lose that 2% off your bottom line every time someone swipes a card.",
        'Check the current fee schedule for your payment provider and selling channel. The tool models one percentage of the selling price. Fixed charges, fee caps, fulfilment charges and category-specific marketplace fees may need separate treatment; do not assume the default percentage covers them.',
      ],
      [
        'We recommend a <strong>3% to 5% buffer</strong>. This field in the tool acts as an "insurance policy" built into your price, ensuring you don\'t go into the red when the unexpected happens.',
        'Choose a reserve that reflects your order risk. The tool applies your buffer percentage to landed cost plus marketing cost. A buffer is a planning allowance, not insurance or protection against every loss.',
      ],
      [
        'Want to run a "Black Friday" sale or a 10% off launch promo? If you build your base price with a promo discount in mind, you can offer these deals without eating into your core profit.',
        'The promo field applies a discount to the calculated retail price; it does not increase that base price to preserve your target margin. Recalculate profit at the discounted price before running a promotion.',
      ],
      [
        'ensuring your partners make money while you still remain profitable.',
        'but that discounted price may fall below your break-even level. Check costs and profit again before offering it to resellers.',
      ],
      [
        '(30% is a safe starting point for most).',
        '(a calculator default is not a safe margin for every product).',
      ],
      [
        '<strong>Always include a 3% Buffer</strong> for the "Nigerian Factor."',
        '<strong>Test an appropriate cost buffer</strong> against the risks of your order.',
      ],
    ],
    html: `<section data-seo-module="${marker}">
<h2>UK selling prices: markup is not profit margin</h2>
<p>For a UK launch, build your cost sheet in GBP using consistent conversion assumptions. The Nigeria-focused examples below still explain the method, but the Retail Price Builder currently displays USD or NGN and does not convert currencies. For UK marketplace planning, use the <a href="${calculator}">LineScout Amazon and TikTok Shop profit calculator</a>, select your platform and UK market, and replace sample inputs with your own costs.</p>
<h3>A simple illustrative example</h3>
<p>Suppose one product costs £10 delivered to you and sells for £20. Before selling expenses, the £10 difference is a 100% markup on the £10 cost but a 50% margin on the £20 selling price. Those are different measurements.</p>
<p>If fulfilment, platform fees, advertising and an allowance for returns total £6 per sale, £4 remains before other business expenses and income tax. That is 20% of the selling price, not 50%. These figures are invented solely to explain the arithmetic; they are not current fees, a product quote or a profit forecast. The example excludes VAT effects, which must be handled consistently in your actual calculation.</p>
<ul><li><strong>Landed cost:</strong> the cost of bringing the product to your chosen receiving location.</li><li><strong>Selling costs:</strong> what it costs to make and fulfil a sale after the product arrives.</li><li><strong>Estimated profit:</strong> what remains after the costs included in your model. Missing overheads or taxes can change the result.</li><li><strong>Discount check:</strong> model the actual reduced selling price; a profitable full price does not guarantee a profitable promotion.</li></ul>
<p>Use our <a href="${hub}">China-to-UK importing guide</a> for procurement planning. For channel-specific preparation, read the <a href="https://linescout.sureimports.com/sell-on-amazon">Amazon selling guide</a> or <a href="https://linescout.sureimports.com/sell-on-tiktok-shop">TikTok Shop selling guide</a>. The calculator estimates outcomes from your inputs; it does not predict sales or retrieve live platform fees.</p>
</section>`,
  },
  {
    slug: 'the-ultimate-guide-to-mastering-your-profit-margins-how-to-use-the-landed-cost-estimator-for-china-imports',
    anchor: '<h2>What is Landed Cost and Why Does It Matter?</h2>',
    corrections: [
      [
        'ensure every shipment you bring in is a financial win.',
        'compare estimated costs before committing money; no calculator can guarantee a profitable shipment.',
      ],
      [
        'you are only seeing about 40% to 60% of the actual picture.',
        'you are missing costs whose share of the total varies by product and route.',
      ],
      [
        'The tool automatically updates the "All-in Rate" (e.g., $10/kg) based on current market realities.',
        'Check the displayed rate and confirm it against a current quote for the selected destination and shipment. A displayed or fallback rate is not a binding quote.',
      ],
      [
        'Now, look at the Nigerian market. If power banks of that quality sell for the equivalent of $25, you know you have a $10 margin per unit. If they sell for $16, you know this specific product is a bad investment after shipping costs. This level of clarity is what separates the 40,000 successful merchants on Sure Imports from those who fail in their first month.',
        'In that illustrative example, a $25 selling price leaves $10 before selling expenses; it is not $10 of net profit. Deduct fulfilment, fees, marketing, returns and other relevant expenses before assessing the opportunity. Registered-user numbers are not evidence that every user or order is profitable.',
      ],
      [
        'When you see an item for 20 RMB (about $2.80), it feels "cheap." But if that item is heavy (like a cast-iron skillet), the shipping cost might be $15 per unit.',
        'A low RMB listing price can still lead to a high delivered cost for a heavy or bulky item. Use a current conversion assumption and an actual freight quote rather than judging by the listing price alone.',
      ],
      [
        'Our Landed Cost Estimator reflects our commitment to transparency. When we say "All-in Rates," we mean it. We include shipping, duties, and taxes in the calculation so that the number you see is as close to reality as possible. This transparency is why we have grown into a community of tens of thousands of merchants. We believe that if you are successful and profitable, we are successful as your logistics partner.',
        'The estimator adds product cost to the selected shipping rate multiplied by the entered chargeable weight or volume. It does not independently calculate every duty, tax or handling charge. Confirm in writing what the selected quote includes and add any excluded costs separately. Do not assume an all-in description applies unchanged to every country or shipment.',
      ],
      [
        'Calculate your costs, plan your pricing, and secure your profit.',
        'Estimate your costs, confirm the quote and test whether your selling price leaves enough room for expenses.',
      ],
    ],
    html: `<section data-seo-module="${marker}">
<h2>Estimating landed cost for goods going to the UK</h2>
<p>The Nigerian examples below should not be reused as UK freight or tax assumptions. Begin with the <a href="${hub}">China-to-UK importing guide</a> and obtain a quote for the actual goods, carton data and UK delivery postcode.</p>
<ul><li><strong>Define the endpoint:</strong> say whether your budget ends at a warehouse, your premises or another receiving address. Delivery to your customer is a separate selling cost unless explicitly included.</li><li><strong>List each charge once:</strong> record goods, branding, China delivery, sourcing support, freight and destination charges. Mark each as included, excluded or not yet confirmed in the quote.</li><li><strong>Use one comparison currency:</strong> keep the original quote currency and record the rate used to express it in GBP. Add conversion costs where applicable instead of treating a currency symbol change as conversion.</li><li><strong>Check destination requirements:</strong> consult the <a href="https://www.gov.uk/import-goods-into-uk">official UK import checklist</a> for the relevant route. Do not insert a single assumed duty or tax rate for every product.</li></ul>
<p>For a simple illustration, £1,200 of total allocated purchase and delivery costs spread over 100 saleable units gives £12 per unit. This is arithmetic, not a quote, and it is only complete if all relevant costs are included consistently. Samples, damaged units or additional charges can change the amount allocated to each saleable unit.</p>
<p>Then use that cost in the <a href="${calculator}">Amazon and TikTok Shop profit calculator</a> with the UK market selected to add selling expenses. Landed cost helps you establish the cost base; it does not tell you what customers will pay or guarantee a profitable launch.</p>
</section>`,
  },
];
