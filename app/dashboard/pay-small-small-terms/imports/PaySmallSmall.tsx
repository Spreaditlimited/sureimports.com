import svgPaths from "./svg-htimv6y8us";
import imgImage from "figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png";
import imgSubtract from "figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png";
import { imgImage1 } from "./svg-znnzx";

function Image() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div
        className="[grid-area:1_/_1] bg-neutral-50 h-[456px] ml-0 mt-0 relative rounded-[20px] w-[560px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
      <div
        className="[grid-area:1_/_1] bg-[100%_49.4%] bg-no-repeat bg-size-[101.62%_159.91%] h-[425px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36px_-15px] mask-size-[560px_456px] ml-9 mt-[15px] w-[489px]"
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
      className="[grid-area:1_/_1] box-border content-stretch flex flex-col gap-2.5 items-start justify-center ml-0 mt-0 p-0 relative w-[560px]"
      data-name="Image"
    >
      <Image />
      <div
        className="bg-neutral-50 h-[217px] relative rounded-[20px] shrink-0 w-[560px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
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
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
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
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[20px] text-indigo-800">
        <p className="block leading-[30px] text-nowrap whitespace-pre">
          ₦1,015,875.00
        </p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] text-slate-800">
        <p className="block leading-[26px] text-nowrap whitespace-pre">
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
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[28px] text-left text-slate-800 w-[479px]">
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
      className="[grid-area:1_/_1] box-border content-stretch flex flex-col gap-2.5 items-start justify-start ml-[30px] mt-[496px] p-0 relative"
      data-name="Text"
    >
      <Tag />
      <Text1 />
    </div>
  );
}

function Group1321315022() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Image1 />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[5px] items-start justify-start leading-[0] left-[30px] not-italic p-0 text-[14px] text-left text-slate-800 top-[73px] w-[984px]"
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

function Field() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[10px] shrink-0 w-full"
      data-name="Field"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-[15px] py-3 relative w-full">
          <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-[rgba(30,41,59,0.7)] text-left">
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
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-full">
        <p className="block leading-[24px]">Phone Number</p>
      </div>
      <Field />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-2.5 items-start justify-start left-[30px] p-0 top-[490px] w-[984px]"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-full">
        <p className="block leading-[26px]">{`To proceed, please ensure your SureImports account profile includes your phone number. If it's missing, kindly enter it below:`}</p>
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 h-12 items-center justify-center left-[30px] px-[30px] py-2.5 rounded-[10px] top-[657px] w-[984px]"
      data-name="Button"
    >
      <VuesaxOutlineAdd1 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">
          Add Product to Pay Small Small
        </p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[45px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[221px]"
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
    <div className="absolute contents left-[30px] top-[206px]">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[30px] rounded-[10px] top-[206px] w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag1 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[45px] not-italic text-[14px] text-left text-slate-800 top-[257px] w-[159px]">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[244px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[221px]"
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
    <div className="absolute contents left-[229px] top-[206px]">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[229px] rounded-[10px] top-[206px] w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag2 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[244px] not-italic text-[14px] text-left text-slate-800 top-[257px] w-[159px]">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[443px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[221px]"
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
    <div className="absolute contents left-[428px] top-[206px]">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[428px] rounded-[10px] top-[206px] w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag3 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[443px] not-italic text-[14px] text-left text-slate-800 top-[257px] w-[159px]">
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
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[642px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[221px]"
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
    <div className="absolute contents left-[627px] top-[206px]">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[627px] rounded-[10px] top-[206px] w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag4 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[642px] not-italic text-[14px] text-left text-slate-800 top-[257px] w-[159px]">
        <p className="block leading-[22px]">{`To activate your pay small smalls account, you'll be required to make a deposit of ₦5,000 to the dedicated virtual account created for you.`}</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="absolute bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-[841px] px-2.5 py-1.5 rounded-[30px] size-[26px] top-[221px]"
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
    <div className="absolute contents left-[826px] top-[206px]">
      <div
        className="absolute bg-[#ffffff] h-[264px] left-[826px] rounded-[10px] top-[206px] w-[189px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Tag5 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[841px] not-italic text-[14px] text-left text-slate-800 top-[257px] w-[159px]">
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
    <div className="absolute contents left-[30px] top-[206px]">
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
      className="bg-neutral-50 h-[735px] relative rounded-[20px] shrink-0 w-[1044px]"
      data-name="Text"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <div className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] left-[30px] not-italic text-[18px] text-left text-slate-800 top-[30px] w-[984px]">
        <p className="block leading-[28px]">Pay Small Small</p>
      </div>
      <Text3 />
      <div className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] left-[30px] not-italic text-[16px] text-left text-slate-800 top-[170px] w-[984px]">
        <p className="block leading-[26px]">{`Here's how it works:`}</p>
      </div>
      <Text5 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[30px] not-italic text-[14px] text-left text-slate-800 top-[613px] w-[984px]">
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
      className="absolute box-border content-stretch flex flex-row gap-[30px] items-start justify-start left-64 p-0 top-[172px]"
      data-name="Content"
    >
      <Group1321315022 />
      <Text6 />
    </div>
  );
}

export default function PaySmallSmall() {
  return (
    <div className="bg-slate-50 relative size-full" data-name="Pay Small Small">
      <div
        className="absolute h-[942px] left-0 top-0 w-[1920px]"
        data-name="Subtract"
      >
        <img
          className="block max-w-none size-full"
          height="942"
          src={imgSubtract}
          width="1920"
        />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] left-64 not-italic text-[22px] text-left text-nowrap text-slate-800 top-[110px]">
        <p className="block leading-[32px] whitespace-pre">Pay Small Small</p>
      </div>
      <Content />
    </div>
  );
}