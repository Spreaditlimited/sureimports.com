import svgPaths from "./svg-f4xdchptqj";
import imgImage14 from "figma:asset/5b6f4bbdab7c47655211170a7ebc9dd2b6e1272f.png";
import imgImage11 from "figma:asset/9624e54c7174fd81a33c10142056073f6d62d55d.png";
import { imgImage15, imgGroup, imgGroup1 } from "./svg-fc9ff";

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[22px] text-left text-nowrap text-slate-800">
        <p className="block leading-[34px] whitespace-pre">Shopping Cart</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Title"
    >
      <Text />
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
        className="[grid-area:1_/_1] bg-center bg-cover bg-no-repeat h-[145px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-1px] mask-size-[145px_145px] ml-[-16px] mt-px w-[178px]"
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
      <div className="[grid-area:1_/_1] bg-neutral-50 ml-0 mt-0 relative rounded-[10px] size-[145px]">
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <MaskGroup />
    </div>
  );
}

function Frame42() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[5px] items-start justify-start p-0 relative shrink-0">
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] w-[682px]">
        <p className="block leading-[26px]">HP EliteBook x360 1040 G8</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-[682px]">
        <p className="block leading-[24px]">Color : Gray</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-[682px]">
        <p className="block leading-[24px]">Brand : HP</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[15px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800">
      <Frame42 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[0px] w-[682px]">
        <p>
          <span className="leading-[26px] text-[18px]">{`Price : `}</span>
          <span className="font-['Inter:Medium',_sans-serif] font-medium leading-[30px] not-italic text-[20px]">
            ₦19,35,000.00
          </span>
        </p>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-0 relative shrink-0">
      <Image />
      <Frame43 />
    </div>
  );
}

function Group() {
  return (
    <div
      className="absolute inset-[5.21%_9.4%_5.21%_9.36%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.871px_-1.042px] mask-size-[20px_20px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p25e0dc00}
            fill="var(--fill-0, #F24444)"
            id="Vector"
          />
          <path
            d={svgPaths.p61e3700}
            fill="var(--fill-0, #F24444)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p10e1fc00}
            fill="var(--fill-0, #F24444)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p24d19500}
            fill="var(--fill-0, #F24444)"
            id="Vector_4"
          />
          <path
            d={svgPaths.p119fe100}
            fill="var(--fill-0, #F24444)"
            id="Vector_5"
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="overflow-clip relative shrink-0 size-5" data-name="Frame">
      <ClipPathGroup />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[rgba(242,68,68,0.3)] box-border content-stretch flex flex-row gap-5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(242,68,68,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <Frame />
    </div>
  );
}

function Group1() {
  return (
    <div
      className="absolute bottom-1/2 left-1/4 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-12px] mask-size-[24px_24px] right-1/4 top-1/2"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup1}')` }}
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

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="overflow-clip relative shrink-0 size-6" data-name="Frame">
      <ClipPathGroup1 />
    </div>
  );
}

function Group2() {
  return (
    <div
      className="absolute inset-1/4 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px] mask-size-[24px_24px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup1}')` }}
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

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="overflow-clip relative shrink-0 size-6" data-name="Frame">
      <ClipPathGroup2 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-12 relative rounded-[10px] shrink-0 w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-5 h-12 items-center justify-start px-[15px] py-3 relative w-full">
          <Frame1 />
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-800">
            <p className="block leading-[24px] whitespace-pre">2</p>
          </div>
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[57px] items-end justify-start p-0 relative shrink-0 w-32">
      <Frame15 />
      <Frame14 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-[990px]">
      <Frame45 />
      <Frame44 />
    </div>
  );
}

function MaskGroup1() {
  return (
    <div
      className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative"
      data-name="Mask group"
    >
      <div
        className="[grid-area:1_/_1] bg-center bg-cover bg-no-repeat h-[124px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-5px] mask-size-[145px_145px] ml-0 mt-[5px] w-[130px]"
        data-name="image 11"
        style={{
          backgroundImage: `url('${imgImage11}')`,
          maskImage: `url('${imgImage15}')`,
        }}
      />
    </div>
  );
}

function Image1() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div className="[grid-area:1_/_1] bg-neutral-50 ml-0 mt-0 relative rounded-[10px] size-[145px]">
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <MaskGroup1 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[5px] items-start justify-start p-0 relative shrink-0">
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] w-[682px]">
        <p className="block leading-[26px]">{`MacBook Air 13.6" M2 Chip 8GB 512GB`}</p>
      </div>
      <div
        className="font-['Inter:Regular',_sans-serif] font-normal min-w-full relative shrink-0 text-[16px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[24px]">Color : Gray</p>
      </div>
      <div
        className="font-['Inter:Regular',_sans-serif] font-normal min-w-full relative shrink-0 text-[16px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[24px]">Brand : Apple</p>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[15px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800">
      <Frame48 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[0px] text-nowrap">
        <p className="whitespace-pre">
          <span className="leading-[26px] text-[18px]">{`Price : `}</span>
          <span className="font-['Inter:Medium',_sans-serif] font-medium leading-[30px] not-italic text-[20px]">
            ₦1,147,500.00
          </span>
        </p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-0 relative shrink-0">
      <Image1 />
      <Frame49 />
    </div>
  );
}

function Group3() {
  return (
    <div
      className="absolute inset-[5.21%_9.4%_5.21%_9.36%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.871px_-1.042px] mask-size-[20px_20px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p25e0dc00}
            fill="var(--fill-0, #F24444)"
            id="Vector"
          />
          <path
            d={svgPaths.p61e3700}
            fill="var(--fill-0, #F24444)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p10e1fc00}
            fill="var(--fill-0, #F24444)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p24d19500}
            fill="var(--fill-0, #F24444)"
            id="Vector_4"
          />
          <path
            d={svgPaths.p119fe100}
            fill="var(--fill-0, #F24444)"
            id="Vector_5"
          />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="overflow-clip relative shrink-0 size-5" data-name="Frame">
      <ClipPathGroup3 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[rgba(242,68,68,0.3)] box-border content-stretch flex flex-row gap-5 items-center justify-start p-[10px] relative rounded-[10px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(242,68,68,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <Frame3 />
    </div>
  );
}

function Group4() {
  return (
    <div
      className="absolute bottom-1/2 left-1/4 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-12px] mask-size-[24px_24px] right-1/4 top-1/2"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup1}')` }}
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

function ClipPathGroup4() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="overflow-clip relative shrink-0 size-6" data-name="Frame">
      <ClipPathGroup4 />
    </div>
  );
}

function Group5() {
  return (
    <div
      className="absolute inset-1/4 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px] mask-size-[24px_24px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup1}')` }}
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

function ClipPathGroup5() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="overflow-clip relative shrink-0 size-6" data-name="Frame">
      <ClipPathGroup5 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-12 relative rounded-[10px] shrink-0 w-full">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-5 h-12 items-center justify-start px-[15px] py-3 relative w-full">
          <Frame4 />
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-800">
            <p className="block leading-[24px] whitespace-pre">1</p>
          </div>
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[57px] items-end justify-start p-0 relative shrink-0 w-32">
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-[990px]">
      <Frame50 />
      <Frame51 />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-center p-[30px] relative rounded-[20px] shrink-0"
      data-name="Card -1"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[20px] text-left text-slate-800 w-[990px]">
        <p className="block leading-[30px]">Ordered Item’s :</p>
      </div>
      <div className="h-0 relative shrink-0 w-[990px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 990 1"
          >
            <line
              id="Line 204"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="990"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Frame46 />
      <div className="h-0 relative shrink-0 w-[990px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 990 1"
          >
            <line
              id="Line 204"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="990"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Frame47 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[30px] items-center justify-center p-0 relative shrink-0">
      <Card1 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="box-border content-stretch flex flex-row gap-5 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800">
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 w-[355px]">
        <p className="block leading-[24px]">Subtotal :</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 w-[120px]">
        <p className="block leading-[24px]">₦30,32,500.00</p>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="box-border content-stretch flex flex-row gap-5 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800">
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 w-[355px]">
        <p className="block leading-[24px]">Shipping Charge’s :</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 w-[120px]">
        <p className="block leading-[24px]">₦1,000.00</p>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="box-border content-stretch flex flex-row gap-5 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800">
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 w-[355px]">
        <p className="block leading-[24px]">{`Tax : `}</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 w-[120px]">
        <p className="block leading-[24px]">₦2,500.00</p>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[15px] items-start justify-start p-0 relative shrink-0">
      <Frame38 />
      <Frame39 />
      <Frame40 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="box-border content-stretch flex flex-row font-['Inter:Semi_Bold',_sans-serif] font-semibold gap-5 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[20px] text-left text-slate-800">
      <div className="relative shrink-0 w-[301px]">
        <p className="block leading-[30px]">Total :</p>
      </div>
      <div className="relative shrink-0 w-[174px]">
        <p className="block leading-[30px]">₦30,36,000.00</p>
      </div>
    </div>
  );
}

function VuesaxOutlineArrowRight() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/arrow-right"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="arrow-right">
          <path d={svgPaths.p261e480} fill="var(--fill-0, white)" id="Vector" />
          <path
            d={svgPaths.p1fa47c80}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p10ac3380}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineArrowRight1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/arrow-right"
    >
      <VuesaxOutlineArrowRight />
    </div>
  );
}

function Button() {
  return (
    <div
      className="[grid-area:1_/_1] bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center ml-[355px] mt-0.5 px-[30px] py-2.5 relative rounded-[10px]"
      data-name="Button"
    >
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">Apply</p>
      </div>
      <VuesaxOutlineArrowRight1 />
    </div>
  );
}

function VuesaxOutlineDiscountShape() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/discount-shape"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="discount-shape">
          <path
            d={svgPaths.p3623000}
            fill="var(--fill-0, #1E293B)"
            id="Vector"
          />
          <path
            d={svgPaths.p2ea8de00}
            fill="var(--fill-0, #1E293B)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p295a6900}
            fill="var(--fill-0, #1E293B)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p2dd4b600}
            fill="var(--fill-0, #1E293B)"
            id="Vector_4"
          />
          <g id="Vector_5" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineDiscountShape1() {
  return (
    <div
      className="[grid-area:1_/_1] ml-[15px] mt-3 relative size-6"
      data-name="vuesax/outline/discount-shape"
    >
      <VuesaxOutlineDiscountShape />
    </div>
  );
}

function Group1321315010() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-[#ffffff] h-12 ml-0 mt-0 relative rounded-[10px] w-[495px]">
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <Button />
      <VuesaxOutlineDiscountShape1 />
      <div className="[grid-area:1_/_1] font-['Inter:Regular',_sans-serif] font-normal ml-[49px] mt-3 not-italic relative text-[14px] text-[rgba(30,41,59,0.7)] text-left text-nowrap">
        <p className="block leading-[24px] whitespace-pre">Add Promo Code</p>
      </div>
    </div>
  );
}

function VuesaxOutlineArrowRight2() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/arrow-right"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="arrow-right">
          <path d={svgPaths.p261e480} fill="var(--fill-0, white)" id="Vector" />
          <path
            d={svgPaths.p1fa47c80}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p10ac3380}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineArrowRight3() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/arrow-right"
    >
      <VuesaxOutlineArrowRight2 />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="bg-indigo-800 relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[30px] py-2.5 relative w-full">
          <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left text-nowrap">
            <p className="block leading-[28px] whitespace-pre">Checkout Now</p>
          </div>
          <VuesaxOutlineArrowRight3 />
        </div>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-center p-[30px] relative rounded-[20px] shrink-0"
      data-name="Card -1"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <div
        className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] min-w-full not-italic relative shrink-0 text-[24px] text-left text-slate-800"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[34px]">Order Summary</p>
      </div>
      <div className="h-0 relative shrink-0 w-[495px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 495 1"
          >
            <line
              id="Line 203"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="495"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Frame52 />
      <div className="h-0 relative shrink-0 w-[495px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 495 1"
          >
            <line
              id="Line 203"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="495"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Frame41 />
      <Group1321315010 />
      <Button1 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[30px] items-center justify-center p-0 relative shrink-0">
      <Card2 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[30px] items-start justify-start p-0 relative shrink-0">
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function VuesaxOutlineCloseCircle() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/close-circle"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="close-circle">
          <path d={svgPaths.p261e480} fill="var(--fill-0, white)" id="Vector" />
          <path
            d={svgPaths.pc509a80}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p30b5df00}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineCloseCircle1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/close-circle"
    >
      <VuesaxOutlineCloseCircle />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="bg-slate-600 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[30px] py-2.5 relative rounded-[10px] shrink-0"
      data-name="Button"
    >
      <VuesaxOutlineCloseCircle1 />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">Clear Cart</p>
      </div>
    </div>
  );
}

export default function Text1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative size-full"
      data-name="Text"
    >
      <Title />
      <Frame37 />
      <Button2 />
    </div>
  );
}