// @ts-nocheck
import svgPaths from './svg-htimv6y8us';
import imgImage from 'figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png';
import imgSubtract from 'figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png';
import { imgImage1 } from './svg-znnzx';

function Image() {
  return (
    <div
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div
        className="relative ml-0 mt-0 h-[456px] w-[560px] rounded-[20px] bg-neutral-50 [grid-area:1_/_1]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div
        className="bg-size-[101.62%_159.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-15px] mask-size-[560px_456px] ml-9 mt-[15px] h-[425px] w-[489px] bg-[100%_49.4%] bg-no-repeat [grid-area:1_/_1]"
        data-name="Image"
        style={{
          backgroundImage: `url('${imgImage}')`,
          maskImage: `url('${imgImage1}')`,
        }}
      />
    </div>
  );
}

function Image1() {
  return (
    <div
      className="relative ml-0 mt-0 box-border flex w-[560px] flex-col content-stretch items-start justify-center gap-2.5 p-0 [grid-area:1_/_1]"
      data-name="Image"
    >
      <Image />
      <div
        className="relative h-[217px] w-[560px] shrink-0 rounded-[20px] bg-neutral-50"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-5 py-1.5"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">HP</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-[5px] text-nowrap p-0 text-left not-italic leading-[0]"
      data-name="Text"
    >
      <div className="relative shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[20px] font-semibold text-indigo-800">
        <p className="block whitespace-pre text-nowrap leading-[30px]">
          ₦1,015,875.00
        </p>
      </div>
      <div className="relative shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal text-slate-800">
        <p className="block whitespace-pre text-nowrap leading-[26px]">
          Inclusive of 5% PSS Fee
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0"
      data-name="Text"
    >
      <div className="relative w-[479px] shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[28px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[38px]">
          HP EliteBook x360 1040 G8 – Power Meets Elegance
        </p>
      </div>
      <Text />
    </div>
  );
}

function Text2() {
  return (
    <div
      className="relative ml-[30px] mt-[496px] box-border flex flex-col content-stretch items-start justify-start gap-2.5 p-0 [grid-area:1_/_1]"
      data-name="Text"
    >
      <Tag />
      <Text1 />
    </div>
  );
}

function Group1321315022() {
  return (
    <div className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
      <Image1 />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="absolute left-[30px] top-[73px] box-border flex w-[984px] flex-col content-stretch items-start justify-start gap-[5px] p-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-full shrink-0">
        <p className="block leading-[24px]">{`Thank you for choosing the "Pay Small Small" option on SureImports.`}</p>
      </div>
      <div className="relative w-full shrink-0">
        <p className="block leading-[24px]">
          This flexible payment plan allows you to pay for your selected product
          in convenient installments over a maximum period of 6 months. Once
          your payment is complete, your item will be shipped from China to
          Lagos, Nigeria.
        </p>
      </div>
    </div>
  );
}

function Field() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[10px] bg-[rgba(255,255,255,0)]"
      data-name="Field"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.3)]"
      />
      <div className="relative flex size-full flex-row items-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-start gap-2.5 px-[15px] py-3">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-[rgba(30,41,59,0.7)]">
            <p className="block leading-[24px]">Enter a Valid Phone Number</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-start gap-[5px] p-0"
      data-name="Text"
    >
      <div className="relative w-full shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Phone Number</p>
      </div>
      <Field />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="absolute left-[30px] top-[490px] box-border flex w-[984px] flex-col content-stretch items-start justify-start gap-2.5 p-0"
      data-name="Text"
    >
      <div className="relative w-full shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">{`To proceed, please ensure your SureImports account profile includes your phone number. If it's missing, kindly enter it below:`}</p>
      </div>
      <Text4 />
    </div>
  );
}

function VuesaxOutlineAdd() {
  return (
    <div className="absolute inset-0 contents" data-name="vuesax/outline/add">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="add">
          <path
            d={svgPaths.p3d9bb080}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.p4cbce00}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineAdd1() {
  return (
    <div className="relative size-6 shrink-0" data-name="vuesax/outline/add">
      <VuesaxOutlineAdd />
    </div>
  );
}

function Button() {
  return (
    <div
      className="absolute left-[30px] top-[657px] box-border flex h-12 w-[984px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-indigo-800 px-[30px] py-2.5"
      data-name="Button"
    >
      <VuesaxOutlineAdd1 />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[28px]">
          Add Product to Pay Small Small
        </p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div
      className="absolute left-[45px] top-[221px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">01</p>
      </div>
    </div>
  );
}

function Group1321315004() {
  return (
    <div className="absolute left-[30px] top-[206px] contents">
      <div
        className="absolute left-[30px] top-[206px] h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag1 />
      <div className="absolute left-[45px] top-[257px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[22px]">
          When you click the button below, a virtual payment account will be
          created for you. You can pay into this account at your own pace, as
          long as full payment is completed within 6 months.
        </p>
      </div>
    </div>
  );
}

function Tag2() {
  return (
    <div
      className="absolute left-[244px] top-[221px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">02</p>
      </div>
    </div>
  );
}

function Group1321315005() {
  return (
    <div className="absolute left-[229px] top-[206px] contents">
      <div
        className="absolute left-[229px] top-[206px] h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag2 />
      <div className="absolute left-[244px] top-[257px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[22px]">
          All payments made through this plan attract a 5% additional fee. This
          helps us manage exchange rate fluctuations in Nigeria and charges from
          our payment processor.
        </p>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div
      className="absolute left-[443px] top-[221px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">03</p>
      </div>
    </div>
  );
}

function Group1321315006() {
  return (
    <div className="absolute left-[428px] top-[206px] contents">
      <div
        className="absolute left-[428px] top-[206px] h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag3 />
      <div className="absolute left-[443px] top-[257px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[22px]">
          Your product will only be shipped after full payment has been
          received.
        </p>
      </div>
    </div>
  );
}

function Tag4() {
  return (
    <div
      className="absolute left-[642px] top-[221px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">04</p>
      </div>
    </div>
  );
}

function Group1321315007() {
  return (
    <div className="absolute left-[627px] top-[206px] contents">
      <div
        className="absolute left-[627px] top-[206px] h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag4 />
      <div className="absolute left-[642px] top-[257px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[22px]">{`To activate your pay small smalls account, you'll be required to make a deposit of ₦5,000 to the dedicated virtual account created for you.`}</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="absolute left-[841px] top-[221px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">05</p>
      </div>
    </div>
  );
}

function Group1321315008() {
  return (
    <div className="absolute left-[826px] top-[206px] contents">
      <div
        className="absolute left-[826px] top-[206px] h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag5 />
      <div className="absolute left-[841px] top-[257px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[22px]">
          You can choose to cancel at any time. In such cases, we will process a
          refund of the total amount paid, less 2.5% to cover administrative
          costs.
        </p>
      </div>
    </div>
  );
}

function Group1321315009() {
  return (
    <div className="absolute left-[30px] top-[206px] contents">
      <Group1321315004 />
      <Group1321315005 />
      <Group1321315006 />
      <Group1321315007 />
      <Group1321315008 />
    </div>
  );
}

function Text6() {
  return (
    <div
      className="relative h-[735px] w-[1044px] shrink-0 rounded-[20px] bg-neutral-50"
      data-name="Text"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="absolute left-[30px] top-[30px] w-[984px] text-left font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[28px]">Pay Small Small</p>
      </div>
      <Text3 />
      <div className="absolute left-[30px] top-[170px] w-[984px] text-left font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">{`Here's how it works:`}</p>
      </div>
      <Text5 />
      <div className="absolute left-[30px] top-[613px] w-[984px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">
          Once ready, click the button below to begin.
        </p>
      </div>
      <Button />
      <Group1321315009 />
    </div>
  );
}

function Content() {
  return (
    <div
      className="absolute left-64 top-[172px] box-border flex flex-row content-stretch items-start justify-start gap-[30px] p-0"
      data-name="Content"
    >
      <Group1321315022 />
      <Text6 />
    </div>
  );
}

export default function PaySmallSmall() {
  return (
    <div className="relative size-full bg-slate-50" data-name="Pay Small Small">
      <div
        className="absolute left-0 top-0 h-[942px] w-[1920px]"
        data-name="Subtract"
      >
        <img
          className="block size-full max-w-none"
          height="942"
          src={imgSubtract}
          width="1920"
        />
      </div>
      <div className="absolute left-64 top-[110px] text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[22px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[32px]">Pay Small Small</p>
      </div>
      <Content />
    </div>
  );
}
