import svgPaths from './svg-xie0mhws6u';
import imgImage from 'figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png';
import imgSureimportsReverse from 'figma:asset/84c7e5da1d268b600da8ab16cf73ccc4cef6b5ac.png';
import { imgImage1 } from './svg-a31k4';

function Group() {
  return (
    <div
      className="absolute bottom-[11.84%] left-0 right-0 top-[13.16%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 26 20"
      >
        <g id="Group">
          <path
            d={svgPaths.p26572800}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div
      className="absolute left-96 top-[37px] size-[26px] overflow-clip"
      data-name="Frame"
    >
      <Group />
    </div>
  );
}

function VuesaxOutlineSearchNormal() {
  return (
    <div
      className="absolute inset-0 contents"
      data-name="vuesax/outline/search-normal"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 26 26"
      >
        <g id="search-normal">
          <path
            d={svgPaths.p14b4c900}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.p32503f00}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <g id="Vector_3" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineSearchNormal1() {
  return (
    <div
      className="absolute left-[348px] top-[37px] size-[26px]"
      data-name="vuesax/outline/search-normal"
    >
      <VuesaxOutlineSearchNormal />
    </div>
  );
}

function Image() {
  return (
    <div
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div
        className="relative ml-0 mt-0 size-[390px] rounded-[15px] bg-neutral-50 [grid-area:1_/_1]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[15px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div
        className="bg-size-[101.62%_159.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-53px] mask-size-[390px_390px] ml-[31px] mt-[53px] h-[285px] w-[328px] bg-[100%_49.4%] bg-no-repeat [grid-area:1_/_1]"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-2.5 p-0"
      data-name="Image"
    >
      <Image />
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
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-[#ffffff]">
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
      <div className="relative shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold text-indigo-800">
        <p className="block whitespace-pre text-nowrap leading-[24px]">
          ₦1,015,875.00
        </p>
      </div>
      <div className="relative shrink-0 font-['Inter:Regular',_sans-serif] text-[14px] font-normal text-slate-800">
        <p className="block whitespace-pre text-nowrap leading-[24px]">
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
      <div className="relative w-[350px] shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-2.5 p-0"
      data-name="Text"
    >
      <Tag />
      <Text1 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="relative w-full shrink-0 rounded-[15px] bg-neutral-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[15px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative size-full">
        <div className="relative box-border flex w-full flex-col content-stretch items-start justify-start gap-2.5 p-[20px]">
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="absolute left-5 top-[166px] box-border flex w-[390px] flex-col content-stretch items-start justify-start gap-2.5 p-0">
      <Image1 />
      <Frame58 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="relative box-border flex w-[350px] shrink-0 flex-col content-stretch items-start justify-start gap-[5px] p-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800"
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

function Tag1() {
  return (
    <div
      className="absolute left-[15px] top-[15px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
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
    <div className="absolute left-0 top-0 contents">
      <div
        className="absolute left-0 top-0 h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag1 />
      <div className="absolute left-[15px] top-[51px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="absolute left-[214px] top-[15px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
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
    <div className="absolute left-[199px] top-0 contents">
      <div
        className="absolute left-[199px] top-0 h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag2 />
      <div className="absolute left-[214px] top-[51px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="absolute left-[413px] top-[15px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
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
    <div className="absolute left-[398px] top-0 contents">
      <div
        className="absolute left-[398px] top-0 h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag3 />
      <div className="absolute left-[413px] top-[51px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="absolute left-[612px] top-[15px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
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
    <div className="absolute left-[597px] top-0 contents">
      <div
        className="absolute left-[597px] top-0 h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag4 />
      <div className="absolute left-[612px] top-[51px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[22px]">{`To activate your pay small smalls account, you'll be required to make a deposit of ₦5,000 to the dedicated virtual account created for you.`}</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="absolute left-[811px] top-[15px] box-border flex size-[26px] flex-row content-stretch items-center justify-center gap-2.5 rounded-[30px] bg-indigo-800 px-2.5 py-1.5"
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
    <div className="absolute left-[796px] top-0 contents">
      <div
        className="absolute left-[796px] top-0 h-[264px] w-[189px] rounded-[10px] bg-[#ffffff]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <Tag5 />
      <div className="absolute left-[811px] top-[51px] w-[159px] text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
    <div className="absolute left-0 top-0 contents">
      <Group1321315004 />
      <Group1321315005 />
      <Group1321315006 />
      <Group1321315007 />
      <Group1321315008 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="relative h-[264px] w-[350px] shrink-0 overflow-x-auto overflow-y-clip">
      <Group1321315009 />
    </div>
  );
}

function Group1321315024() {
  return (
    <div className="relative h-[9px] w-[43px] shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 43 9"
      >
        <g id="Group 1321315024">
          <circle
            cx="4.5"
            cy="4.5"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 31"
            r="4.5"
          />
          <circle
            cx="21.5"
            cy="4.5"
            fill="var(--fill-0, #8A85DD)"
            id="Ellipse 32"
            r="4.5"
          />
          <circle
            cx="38.5"
            cy="4.5"
            fill="var(--fill-0, #8A85DD)"
            id="Ellipse 33"
            r="4.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Field() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-[10px] bg-[rgba(255,255,255,0)] p-[10px]"
      data-name="Field"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.3)]"
      />
      <div className="relative w-[330px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-[rgba(30,41,59,0.7)]">
        <p className="block leading-[24px]">Enter a Valid Phone Number</p>
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
      <div className="relative w-[350px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Phone Number</p>
      </div>
      <Field />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-2.5 p-0"
      data-name="Text"
    >
      <div className="relative w-[350px] shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[14px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">{`To proceed, please ensure your SureImports account profile includes your phone number. If it's missing, kindly enter it below:`}</p>
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
      className="relative box-border flex h-12 w-[350px] shrink-0 flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-indigo-800 px-[30px] py-2.5"
      data-name="Button"
    >
      <VuesaxOutlineAdd1 />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">
          Add Product to Pay Small Small
        </p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div
      className="absolute left-5 top-[753px] box-border flex flex-col content-stretch items-center justify-center gap-2.5 rounded-[15px] bg-neutral-50 p-[20px]"
      data-name="Text"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[15px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative w-[350px] shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Pay Small Small</p>
      </div>
      <Text3 />
      <div className="relative w-[350px] shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">{`Here's how it works:`}</p>
      </div>
      <Frame60 />
      <Group1321315024 />
      <Text5 />
      <div className="relative w-[350px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">
          Once ready, click the button below to begin.
        </p>
      </div>
      <Button />
    </div>
  );
}

export default function PaySmallSmallMobile() {
  return (
    <div
      className="relative size-full bg-slate-50"
      data-name="Pay Small Small - Mobile"
    >
      <div className="absolute left-0 top-0 h-[90px] w-[430px] bg-[#0e0e1f]" />
      <div
        className="bg-size-[100%_100%] bg-top-left absolute inset-[2.29%_49.3%_96.16%_4.65%] bg-no-repeat"
        data-name="sureimports_reverse"
        style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
      />
      <Frame />
      <VuesaxOutlineSearchNormal1 />
      <Frame59 />
      <div className="absolute left-5 top-[120px] text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[26px]">Pay Small Small</p>
      </div>
      <Text6 />
    </div>
  );
}
