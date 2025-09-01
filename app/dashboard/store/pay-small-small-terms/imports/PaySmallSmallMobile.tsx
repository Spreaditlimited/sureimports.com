import svgPaths from "./svg-xie0mhws6u";
import imgImage from "figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png";
import imgSureimportsReverse from "figma:asset/84c7e5da1d268b600da8ab16cf73ccc4cef6b5ac.png";
import { imgImage1 } from "./svg-a31k4";

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
      className="absolute left-96 overflow-clip size-[26px] top-[37px]"
      data-name="Frame"
    >
      <Group />
    </div>
  );
}

function VuesaxOutlineSearchNormal() {
  return (
    <div
      className="absolute contents inset-0"
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
      className="absolute left-[348px] size-[26px] top-[37px]"
      data-name="vuesax/outline/search-normal"
    >
      <VuesaxOutlineSearchNormal />
    </div>
  );
}

function Image() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div
        className="[grid-area:1_/_1] bg-neutral-50 ml-0 mt-0 relative rounded-[15px] size-[390px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[15px]"
        />
      </div>
      <div
        className="[grid-area:1_/_1] bg-[100%_49.4%] bg-no-repeat bg-size-[101.62%_159.91%] h-[285px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-31px_-53px] mask-size-[390px_390px] ml-[31px] mt-[53px] w-[328px]"
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
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Image"
    >
      <Image />
    </div>
  );
}

function Tag() {
  return (
    <div
      className="bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-1.5 relative rounded-[30px] shrink-0"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[30px]"
      />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">HP</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[5px] items-center justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-nowrap"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] text-indigo-800">
        <p className="block leading-[24px] text-nowrap whitespace-pre">
          ₦1,015,875.00
        </p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[14px] text-slate-800">
        <p className="block leading-[24px] text-nowrap whitespace-pre">
          Inclusive of 5% PSS Fee
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[18px] text-left text-slate-800 w-[350px]">
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
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0"
      data-name="Text"
    >
      <Tag />
      <Text1 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="bg-neutral-50 relative rounded-[15px] shrink-0 w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[15px]"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[20px] relative w-full">
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-2.5 items-start justify-start left-5 p-0 top-[166px] w-[390px]">
      <Image1 />
      <Frame58 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[5px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14px] text-left text-slate-800 w-[350px]"
      data-name="Text"
    >
      <div className="relative shrink-0 w-full">
        <p className="block leading-[24px]">{`Thank you for choosing the "Pay Small Small" option on SureImports.`}</p>
      </div>
      <div className="relative shrink-0 w-full">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[15px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[15px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[30px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">01</p>
      </div>
    </div>
  );
}

function Group1321315004() {
  return (
    <div className="absolute contents left-0 top-0">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-0 rounded-[10px] top-0 w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag1 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[15px] not-italic text-[14px] text-left text-slate-800 top-[51px] w-[159px]">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[214px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[15px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[30px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">02</p>
      </div>
    </div>
  );
}

function Group1321315005() {
  return (
    <div className="absolute contents left-[199px] top-0">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[199px] rounded-[10px] top-0 w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag2 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[214px] not-italic text-[14px] text-left text-slate-800 top-[51px] w-[159px]">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[413px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[15px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[30px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">03</p>
      </div>
    </div>
  );
}

function Group1321315006() {
  return (
    <div className="absolute contents left-[398px] top-0">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[398px] rounded-[10px] top-0 w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag3 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[413px] not-italic text-[14px] text-left text-slate-800 top-[51px] w-[159px]">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[612px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[15px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[30px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">04</p>
      </div>
    </div>
  );
}

function Group1321315007() {
  return (
    <div className="absolute contents left-[597px] top-0">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[597px] rounded-[10px] top-0 w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag4 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[612px] not-italic text-[14px] text-left text-slate-800 top-[51px] w-[159px]">
        <p className="block leading-[22px]">{`To activate your pay small smalls account, you'll be required to make a deposit of ₦5,000 to the dedicated virtual account created for you.`}</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[811px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[15px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[30px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">05</p>
      </div>
    </div>
  );
}

function Group1321315008() {
  return (
    <div className="absolute contents left-[796px] top-0">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[796px] rounded-[10px] top-0 w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag5 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[811px] not-italic text-[14px] text-left text-slate-800 top-[51px] w-[159px]">
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
    <div className="absolute contents left-0 top-0">
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
    <div className="h-[264px] overflow-x-auto overflow-y-clip relative shrink-0 w-[350px]">
      <Group1321315009 />
    </div>
  );
}

function Group1321315024() {
  return (
    <div className="h-[9px] relative shrink-0 w-[43px]">
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
      className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0"
      data-name="Field"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(30,41,59,0.7)] text-left w-[330px]">
        <p className="block leading-[24px]">Enter a Valid Phone Number</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-[350px]">
        <p className="block leading-[24px]">Phone Number</p>
      </div>
      <Field />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-[350px]">
        <p className="block leading-[24px]">{`To proceed, please ensure your SureImports account profile includes your phone number. If it's missing, kindly enter it below:`}</p>
      </div>
      <Text4 />
    </div>
  );
}

function VuesaxOutlineAdd() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/add">
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
    <div className="relative shrink-0 size-6" data-name="vuesax/outline/add">
      <VuesaxOutlineAdd />
    </div>
  );
}

function Button() {
  return (
    <div
      className="bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 h-12 items-center justify-center px-[30px] py-2.5 relative rounded-[10px] shrink-0 w-[350px]"
      data-name="Button"
    >
      <VuesaxOutlineAdd1 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">
          Add Product to Pay Small Small
        </p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div
      className="absolute bg-neutral-50 box-border content-stretch flex flex-col gap-2.5 items-center justify-center left-5 p-[20px] rounded-[15px] top-[753px]"
      data-name="Text"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[15px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[350px]">
        <p className="block leading-[24px]">Pay Small Small</p>
      </div>
      <Text3 />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[350px]">
        <p className="block leading-[26px]">{`Here's how it works:`}</p>
      </div>
      <Frame60 />
      <Group1321315024 />
      <Text5 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-[350px]">
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
      className="bg-slate-50 relative size-full"
      data-name="Pay Small Small - Mobile"
    >
      <div className="absolute bg-[#0e0e1f] h-[90px] left-0 top-0 w-[430px]" />
      <div
        className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left inset-[2.29%_49.3%_96.16%_4.65%]"
        data-name="sureimports_reverse"
        style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
      />
      <Frame />
      <VuesaxOutlineSearchNormal1 />
      <Frame59 />
      <div className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] left-5 not-italic text-[18px] text-left text-nowrap text-slate-800 top-[120px]">
        <p className="block leading-[26px] whitespace-pre">Pay Small Small</p>
      </div>
      <Text6 />
    </div>
  );
}