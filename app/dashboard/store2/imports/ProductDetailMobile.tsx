import svgPaths from "./svg-4aglxup5kq";
import imgImage14 from "figma:asset/5b6f4bbdab7c47655211170a7ebc9dd2b6e1272f.png";
import imgSureimportsReverse from "figma:asset/84c7e5da1d268b600da8ab16cf73ccc4cef6b5ac.png";
import { imgImage15, imgGroup } from "./svg-8lga4";

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

function MaskGroup() {
  return (
    <div
      className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative"
      data-name="Mask group"
    >
      <div
        className="[grid-area:1_/_1] bg-center bg-cover bg-no-repeat h-[313px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[21px_5px] mask-size-[350px_300px] ml-[-21px] mt-[-5px] w-[387px]"
        data-name="image 14"
        style={{
          backgroundImage: `url('${imgImage14}')`,
          maskImage: `url('${imgImage15}')`,
        }}
      />
    </div>
  );
}

function Image() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div className="[grid-area:1_/_1] bg-neutral-50 h-[300px] ml-0 mt-0 relative rounded-[20px] w-[350px]">
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
      <MaskGroup />
    </div>
  );
}

function Frame62() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[15px] items-start justify-start p-0 relative shrink-0 w-[350px]">
      <Image />
    </div>
  );
}

function Frame63() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-5 p-[20px] rounded-[15px] top-[184px]">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[15px]"
      />
      <Frame62 />
    </div>
  );
}

function Component1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0"
      data-name="1"
    >
      <div
        aria-hidden="true"
        className="absolute border border-indigo-800 border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-indigo-800 w-[150px]">
        <p className="block leading-[24px]">Description</p>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0"
      data-name="5"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-slate-800 w-[150px]">
        <p className="block leading-[24px]">Features</p>
      </div>
    </div>
  );
}

function Frame66() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0">
      <Component1 />
      <Component5 />
    </div>
  );
}

function Component4() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0"
      data-name="4"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-slate-800 w-[330px]">
        <p className="block leading-[24px]">Pay Small Small</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Frame66 />
      <Component4 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[15px] items-start justify-start p-0 relative shrink-0">
      <Button />
      <div className="h-0 relative shrink-0 w-[350px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 350 1"
          >
            <line
              id="Line 202"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.2"
              x2="350"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(30,41,59,0.7)] text-left w-[350px]">
        <p className="block leading-[24px]">
          Experience elite performance in a sleek, convertible design with the
          HP EliteBook x360 1040 G8. Built for professionals who demand speed,
          style, and security, this premium 2-in-1 laptop adapts to your
          workflow with ease. Whether you’re a business executive, creative
          professional, or power user, this laptop is designed to keep up with
          your pace and elevate your productivity. With a durable aluminum
          chassis and long battery life, it’s ready for wherever work takes you.
          Style. Speed. Security. All in one. The HP EliteBook x360 1040 G8
          isn’t just a laptop—it’s your mobile command center.
        </p>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-5 p-[20px] rounded-[15px] top-[1575px]">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[15px]"
      />
      <Frame67 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[15px] py-1 relative rounded-[20px] shrink-0">
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap">
        <p className="block leading-[22px] whitespace-pre">HP</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div
      className="absolute bottom-[0.07%] left-0 right-0 top-[0.08%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p304c0b00}
            fill="var(--fill-0, #FFC107)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="[grid-area:1_/_1] h-[18px] ml-0 mt-0 overflow-clip relative w-[17.879px]"
      data-name="Frame"
    >
      <Group1 />
    </div>
  );
}

function Group2() {
  return (
    <div
      className="absolute bottom-[0.07%] left-0 right-0 top-[0.08%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p304c0b00}
            fill="var(--fill-0, #FFC107)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div
      className="[grid-area:1_/_1] h-[18px] ml-[25.03px] mt-0 overflow-clip relative w-[17.879px]"
      data-name="Frame"
    >
      <Group2 />
    </div>
  );
}

function Group3() {
  return (
    <div
      className="absolute inset-[0.08%_-0.01%_0.07%_0.01%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p304c0b00}
            fill="var(--fill-0, #FFC107)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div
      className="[grid-area:1_/_1] h-[18px] ml-[50.061px] mt-0 overflow-clip relative w-[17.879px]"
      data-name="Frame"
    >
      <Group3 />
    </div>
  );
}

function Group4() {
  return (
    <div
      className="absolute inset-[0.08%_-0.01%_0.07%_0.01%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p304c0b00}
            fill="var(--fill-0, #FFC107)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div
      className="[grid-area:1_/_1] h-[18px] ml-[75.091px] mt-0 overflow-clip relative w-[17.879px]"
      data-name="Frame"
    >
      <Group4 />
    </div>
  );
}

function Group5() {
  return (
    <div
      className="absolute bottom-[0.07%] left-0 right-0 top-[0.08%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p304c0b00}
            fill="var(--fill-0, #FFC107)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div
      className="[grid-area:1_/_1] h-[18px] ml-[100.121px] mt-0 overflow-clip relative w-[17.879px]"
      data-name="Frame"
    >
      <Group5 />
    </div>
  );
}

function Group960() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center leading-[0] p-0 relative shrink-0">
      <Group960 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-800">
        <p className="block leading-[24px] whitespace-pre">5.0</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[20px] text-left text-slate-800 w-[350px]">
        <p className="block leading-[30px]">
          HP EliteBook x360 1040 G8 – Power Meets Elegance
        </p>
      </div>
      <Frame32 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-gray-900 text-left">
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[18px] w-[229px]">
        <p className="block leading-[26px]">₦967,500.00</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-[229px]">
        <p className="block leading-[24px]">MOQ - 1</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div
      className="absolute bottom-1/2 left-1/4 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-12px] mask-size-[24px_24px] right-1/4 top-1/2"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-0.75px_-6.25%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 14 2"
        >
          <g id="Group">
            <path
              d="M1 1H13"
              id="Vector"
              stroke="var(--stroke-0, #1E293B)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.7"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="overflow-clip relative shrink-0 size-6" data-name="Frame">
      <ClipPathGroup />
    </div>
  );
}

function Group7() {
  return (
    <div
      className="absolute inset-1/4 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px] mask-size-[24px_24px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-6.25%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 14 14"
        >
          <g id="Group">
            <path
              d="M1 7H13"
              id="Vector"
              stroke="var(--stroke-0, #1E293B)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M7 13V1"
              id="Vector_2"
              stroke="var(--stroke-0, #1E293B)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group7 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="overflow-clip relative shrink-0 size-6" data-name="Frame">
      <ClipPathGroup1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <Frame6 />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-800">
        <p className="block leading-[24px] whitespace-pre">1</p>
      </div>
      <Frame7 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-0 relative shrink-0">
      <Frame64 />
      <Frame24 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-slate-800 w-[150px]">
        <p className="leading-[24px]">
          <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic">
            Color :
          </span>
          <span>{` Silver`}</span>
        </p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-slate-800 w-[150px]">
        <p className="leading-[24px]">
          <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic">
            Brand :
          </span>
          <span>{` HP`}</span>
        </p>
      </div>
    </div>
  );
}

function Frame69() {
  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-start justify-start p-0 relative shrink-0">
      <Frame14 />
      <Frame21 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-slate-800 w-[330px]">
        <p className="leading-[24px]">
          <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic">
            Categories :
          </span>
          <span>{` Laptop`}</span>
        </p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-center text-slate-800 w-[330px]">
        <p className="leading-[24px]">
          <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic">
            Storage :
          </span>
          <span>{` 16GB RAM - 512 GB SSD `}</span>
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <Frame69 />
      <Frame22 />
      <Frame25 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800">
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 w-[350px]">
        <p className="block leading-[24px]">Product Description :</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 w-[350px]">
        <ul className="css-ed5n1g list-disc">
          <li className="mb-0 ms-6">
            <span className="leading-[24px]">{`Experience elite performance in a sleek, convertible design with the HP EliteBook x360 1040 G8. `}</span>
          </li>
          <li className="mb-0 ms-6">
            <span className="leading-[24px]">
              Built for professionals who demand speed, style, and security,
              this premium 2-in-1 laptop adapts to your workflow with ease.
            </span>
          </li>
          <li className="mb-0 ms-6">
            <span className="leading-[24px]">
              Whether you’re a business executive, creative professional, or
              power user, this laptop is designed to keep up with your pace and
              elevate your productivity.
            </span>
          </li>
          <li className="mb-0 ms-6">
            <span className="leading-[24px]">
              With a durable aluminum chassis and long battery life, it’s ready
              for wherever work takes you. Style. Speed. Security. All in one.
            </span>
          </li>
          <li className="ms-6">
            <span className="leading-[24px]">{` The HP EliteBook x360 1040 G8 isn’t just a laptop—it’s your mobile command center.`}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function VuesaxOutlineDollarCircle() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/dollar-circle"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="dollar-circle">
          <path
            d={svgPaths.p3f087f00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.p4cbce00}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p261e480}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineDollarCircle1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/dollar-circle"
    >
      <VuesaxOutlineDollarCircle />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-blue-600 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[15px] py-2.5 relative rounded-[10px] shrink-0 w-[350px]">
      <VuesaxOutlineDollarCircle1 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">Pay Now</p>
      </div>
    </div>
  );
}

function VuesaxOutlineMoney4() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/money-4"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="money-4">
          <path
            d={svgPaths.p3a008300}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.p10caf200}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p3d238200}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p3c727400}
            fill="var(--fill-0, white)"
            id="Vector_4"
          />
          <path
            d={svgPaths.p4d7dcc0}
            fill="var(--fill-0, white)"
            id="Vector_5"
          />
          <path
            d={svgPaths.p2775b700}
            fill="var(--fill-0, white)"
            id="Vector_6"
          />
          <g id="Vector_7" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineMoney5() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/money-4"
    >
      <VuesaxOutlineMoney4 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-purple-600 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[15px] py-2.5 relative rounded-[10px] shrink-0 w-[350px]">
      <VuesaxOutlineMoney5 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">Pay Small Small</p>
      </div>
    </div>
  );
}

function VuesaxOutlineEmptyWallet() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/empty-wallet"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="empty-wallet">
          <path d={svgPaths.pe630880} fill="var(--fill-0, white)" id="Vector" />
          <path
            d={svgPaths.p28711e0}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p2346da80}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p384e0d00}
            fill="var(--fill-0, white)"
            id="Vector_4"
          />
          <g id="Vector_5" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineEmptyWallet1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/empty-wallet"
    >
      <VuesaxOutlineEmptyWallet />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[15px] py-2.5 relative rounded-[10px] shrink-0 w-[350px]">
      <VuesaxOutlineEmptyWallet1 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">Pay From Wallet</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0 w-[350px]"
      data-name="Button"
    >
      <Frame15 />
      <Frame19 />
      <Frame18 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[15px] items-start justify-start p-0 relative shrink-0 w-full">
      <Frame23 />
      <Text />
      <Frame20 />
      <Button1 />
      <Frame52 />
      <Button2 />
    </div>
  );
}

function Text1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-center p-0 relative shrink-0 w-[350px]"
      data-name="Text"
    >
      <Frame68 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-5 p-[20px] rounded-[15px] top-[544px]">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[15px]"
      />
      <Text1 />
    </div>
  );
}

function VuesaxOutlineShoppingCart() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/shopping-cart"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="shopping-cart">
          <path
            d={svgPaths.p3c066000}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.pff6570}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p3e164800}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p1faa6100}
            fill="var(--fill-0, white)"
            id="Vector_4"
          />
          <g id="Vector_5" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineShoppingCart1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/shopping-cart"
    >
      <VuesaxOutlineShoppingCart />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-slate-600 box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <VuesaxOutlineShoppingCart1 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">Back to Store</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-5 items-start justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <Frame26 />
    </div>
  );
}

function Text2() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-5 items-center justify-start left-5 p-0 top-[120px]"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[18px] text-left text-slate-800 w-[213px]">
        <p className="block leading-[26px]">Product Details</p>
      </div>
      <Button3 />
    </div>
  );
}

export default function ProductDetailMobile() {
  return (
    <div
      className="bg-slate-50 relative size-full"
      data-name="Product Detail - Mobile"
    >
      <div className="absolute bg-[#0e0e1f] h-[90px] left-0 top-0 w-[430px]" />
      <div
        className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left inset-[1.75%_49.3%_97.06%_4.65%]"
        data-name="sureimports_reverse"
        style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
      />
      <Frame />
      <VuesaxOutlineSearchNormal1 />
      <Frame63 />
      <Frame65 />
      <Frame70 />
      <Text2 />
    </div>
  );
}