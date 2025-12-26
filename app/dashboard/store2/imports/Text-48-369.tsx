import svgPaths from './svg-azlexlnr7v';
import imgImage14 from 'figma:asset/5b6f4bbdab7c47655211170a7ebc9dd2b6e1272f.png';
import imgImage11 from 'figma:asset/9624e54c7174fd81a33c10142056073f6d62d55d.png';
import { imgImage15, imgGroup } from './svg-hugm4';

function Component1() {
  return (
    <div
      className="relative box-border flex h-12 shrink-0 flex-row content-stretch items-center justify-start gap-5 rounded-[10px] bg-[#ffffff] px-[15px] py-3"
      data-name="1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-indigo-800"
      />
      <div className="relative w-[300px] shrink-0 text-center font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-indigo-800">
        <p className="block leading-[24px]">Upcoming Orders (02)</p>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div
      className="relative box-border flex h-12 shrink-0 flex-row content-stretch items-center justify-start gap-5 rounded-[10px] bg-[#ffffff] px-[15px] py-3"
      data-name="5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.3)]"
      />
      <div className="relative w-[300px] shrink-0 text-center font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Previous Orders (0)</p>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div
      className="relative box-border flex h-12 shrink-0 flex-row content-stretch items-center justify-start gap-5 rounded-[10px] bg-[#ffffff] px-[15px] py-3"
      data-name="4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.3)]"
      />
      <div className="relative w-[300px] shrink-0 text-center font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Returned Order (03)</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-5 p-0"
      data-name="Button"
    >
      <Component1 />
      <Component5 />
      <Component4 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div
      className="relative ml-0 mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start [grid-area:1_/_1]"
      data-name="Mask group"
    >
      <div
        className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[15px_-1px] mask-size-[130px_130px] ml-[-15px] mt-px h-[129px] w-40 bg-cover bg-center bg-no-repeat [grid-area:1_/_1]"
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
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div className="relative ml-0 mt-0 size-[130px] rounded-[10px] bg-neutral-50 [grid-area:1_/_1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <MaskGroup />
    </div>
  );
}

function Tag() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-[10px] bg-indigo-800 p-[10px]"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[26px]">Order Details</p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-[10px] bg-[rgba(242,68,68,0.1)] p-[10px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[#f24444]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#f24444]">
        <p className="block whitespace-pre leading-[26px]">Cancel Order</p>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-5 p-0">
      <Tag />
      <Tag1 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0">
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[26px]">Order No. #1234</p>
      </div>
      <div className="relative w-[451px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">HP EliteBook x360 1040 G8</p>
      </div>
      <div className="relative w-[223px] shrink-0 text-center font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">Quantity : 2</p>
      </div>
      <div className="relative w-[216px] shrink-0 text-center font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[26px]">
          <span className="text-slate-800">₦</span>19,35,000.00
        </p>
      </div>
      <Frame48 />
    </div>
  );
}

function Group() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, white)"
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

function ClipPathGroup() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup />
    </div>
  );
}

function Group1321315011() {
  return (
    <div className="relative ml-0 mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 24"
            r="12"
          />
        </svg>
      </div>
      <Frame />
    </div>
  );
}

function Group1() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, #E3E3E3)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, #E3E3E3)"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup1 />
    </div>
  );
}

function Group1321315016() {
  return (
    <div className="relative ml-[1388px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <g id="Ellipse 24">
            <circle cx="12" cy="12" fill="var(--fill-0, #E3E3E3)" r="12" />
            <circle
              cx="12"
              cy="12"
              r="11.5"
              stroke="var(--stroke-0, #3730A3)"
              strokeOpacity="0.1"
            />
          </g>
        </svg>
      </div>
      <Frame1 />
    </div>
  );
}

function Group2() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, white)"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Frame2() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup2 />
    </div>
  );
}

function Group1321315019() {
  return (
    <div className="relative ml-[694px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 24"
            r="12"
          />
        </svg>
      </div>
      <Frame2 />
    </div>
  );
}

function Group3() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, #E3E3E3)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, #E3E3E3)"
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

function ClipPathGroup3() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Frame3() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup3 />
    </div>
  );
}

function Group1321315017() {
  return (
    <div className="relative ml-[1041px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <g id="Ellipse 24">
            <circle cx="12" cy="12" fill="var(--fill-0, #E3E3E3)" r="12" />
            <circle
              cx="12"
              cy="12"
              r="11.5"
              stroke="var(--stroke-0, #3730A3)"
              strokeOpacity="0.1"
            />
          </g>
        </svg>
      </div>
      <Frame3 />
    </div>
  );
}

function Group4() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, white)"
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

function ClipPathGroup4() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group4 />
    </div>
  );
}

function Frame4() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup4 />
    </div>
  );
}

function Group1321315018() {
  return (
    <div className="relative ml-[347px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 24"
            r="12"
          />
        </svg>
      </div>
      <Frame4 />
    </div>
  );
}

function Group1321315001() {
  return (
    <div className="relative ml-0 mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start [grid-area:1_/_1]">
      <div className="ml-0 mt-2 h-2 w-[1413px] rounded-[20px] bg-[#e3e3e3] [grid-area:1_/_1]" />
      <div className="ml-0 mt-2 h-2 w-[894px] rounded-[20px] bg-indigo-800 [grid-area:1_/_1]" />
      <Group1321315011 />
      <Group1321315016 />
      <Group1321315019 />
      <Group1321315017 />
      <Group1321315018 />
    </div>
  );
}

function Group1321315020() {
  return (
    <div className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
      <Group1321315001 />
      <div className="relative ml-0 mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Confirmed</p>
      </div>
      <div className="relative ml-[322px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Preparing</p>
      </div>
      <div className="relative ml-[675px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Shipped</p>
      </div>
      <div className="relative ml-[1024px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Pick Up</p>
      </div>
      <div className="relative ml-[1340.5px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Delivered</p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-5 p-0">
      <Frame49 />
      <Group1321315020 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="relative box-border flex w-[1573px] shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0">
      <Image />
      <Frame51 />
    </div>
  );
}

function MaskGroup1() {
  return (
    <div
      className="relative ml-0 mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start [grid-area:1_/_1]"
      data-name="Mask group"
    >
      <div
        className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3px_0px] mask-size-[130px_130px] ml-[-3px] mt-0 h-[129px] w-[136px] bg-cover bg-center bg-no-repeat [grid-area:1_/_1]"
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
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div className="relative ml-0 mt-0 size-[130px] rounded-[10px] bg-neutral-50 [grid-area:1_/_1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <MaskGroup1 />
    </div>
  );
}

function Tag2() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-[10px] bg-indigo-800 p-[10px]"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[26px]">Order Details</p>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-[10px] bg-[rgba(242,68,68,0.1)] p-[10px]"
      data-name="Tag"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[#f24444]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#f24444]">
        <p className="block whitespace-pre leading-[26px]">Cancel Order</p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-5 p-0">
      <Tag2 />
      <Tag3 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0">
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[26px]">Order No. #1234</p>
      </div>
      <div className="relative w-[451px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">{`MacBook Air 13.6" M2 Chip 8GB 512GB`}</p>
      </div>
      <div className="relative w-[223px] shrink-0 text-center font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">Quantity : 1</p>
      </div>
      <div className="relative w-[216px] shrink-0 text-center font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">₦1,147,500.00</p>
      </div>
      <Frame50 />
    </div>
  );
}

function Group5() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, white)"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Frame5() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup5 />
    </div>
  );
}

function Group1321315012() {
  return (
    <div className="relative ml-0 mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 24"
            r="12"
          />
        </svg>
      </div>
      <Frame5 />
    </div>
  );
}

function Group6() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, #E3E3E3)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, #E3E3E3)"
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

function ClipPathGroup6() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

function Frame6() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup6 />
    </div>
  );
}

function Group1321315022() {
  return (
    <div className="relative ml-[1388px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <g id="Ellipse 24">
            <circle cx="12" cy="12" fill="var(--fill-0, #E3E3E3)" r="12" />
            <circle
              cx="12"
              cy="12"
              r="11.5"
              stroke="var(--stroke-0, #3730A3)"
              strokeOpacity="0.1"
            />
          </g>
        </svg>
      </div>
      <Frame6 />
    </div>
  );
}

function Group7() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, white)"
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

function ClipPathGroup7() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group7 />
    </div>
  );
}

function Frame7() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup7 />
    </div>
  );
}

function Group1321315023() {
  return (
    <div className="relative ml-[694px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 24"
            r="12"
          />
        </svg>
      </div>
      <Frame7 />
    </div>
  );
}

function Group8() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, #E3E3E3)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, #E3E3E3)"
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

function ClipPathGroup8() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group8 />
    </div>
  );
}

function Frame8() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup8 />
    </div>
  );
}

function Group1321315024() {
  return (
    <div className="relative ml-[1041px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <g id="Ellipse 24">
            <circle cx="12" cy="12" fill="var(--fill-0, #E3E3E3)" r="12" />
            <circle
              cx="12"
              cy="12"
              r="11.5"
              stroke="var(--stroke-0, #3730A3)"
              strokeOpacity="0.1"
            />
          </g>
        </svg>
      </div>
      <Frame8 />
    </div>
  );
}

function Group9() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px] mask-size-[18px_18px] absolute inset-[8.333%]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p154ce600}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3019e600}
              id="Vector_2"
              stroke="var(--stroke-0, white)"
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

function ClipPathGroup9() {
  return (
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group9 />
    </div>
  );
}

function Frame9() {
  return (
    <div
      className="relative ml-[3px] mt-[3px] size-[18px] overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <ClipPathGroup9 />
    </div>
  );
}

function Group1321315025() {
  return (
    <div className="relative ml-[347px] mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0] [grid-area:1_/_1]">
      <div className="relative ml-0 mt-0 size-6 [grid-area:1_/_1]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            fill="var(--fill-0, #3730A3)"
            id="Ellipse 24"
            r="12"
          />
        </svg>
      </div>
      <Frame9 />
    </div>
  );
}

function Group1321315002() {
  return (
    <div className="relative ml-0 mt-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start [grid-area:1_/_1]">
      <div className="ml-0 mt-2 h-2 w-[1413px] rounded-[20px] bg-[#e3e3e3] [grid-area:1_/_1]" />
      <div className="ml-0 mt-2 h-2 w-[894px] rounded-[20px] bg-indigo-800 [grid-area:1_/_1]" />
      <Group1321315012 />
      <Group1321315022 />
      <Group1321315023 />
      <Group1321315024 />
      <Group1321315025 />
    </div>
  );
}

function Group1321315021() {
  return (
    <div className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
      <Group1321315002 />
      <div className="relative ml-0 mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Confirmed</p>
      </div>
      <div className="relative ml-[322px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Preparing</p>
      </div>
      <div className="relative ml-[675px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Shipped</p>
      </div>
      <div className="relative ml-[1024px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Pick Up</p>
      </div>
      <div className="relative ml-[1340.5px] mt-[29px] text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic text-slate-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Delivered</p>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-5 p-0">
      <Frame52 />
      <Group1321315021 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="relative box-border flex w-[1573px] shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0">
      <Image1 />
      <Frame53 />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-center justify-center gap-5 rounded-[20px] bg-[#ffffff] p-[30px]"
      data-name="Card -1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Button />
      <div className="relative h-0 w-[1574px] shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1574 1"
          >
            <line
              id="Line 204"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1574"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <div className="relative w-[1573px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[20px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[30px]">Ordered Item’s :</p>
      </div>
      <Frame34 />
      <div className="relative h-0 w-[1574px] shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1574 1"
          >
            <line
              id="Line 204"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1574"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Frame37 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-[30px] p-0">
      <Card1 />
    </div>
  );
}

export default function Text() {
  return (
    <div
      className="relative box-border flex size-full flex-col content-stretch items-start justify-start gap-5 p-0"
      data-name="Text"
    >
      <div
        className="relative min-w-full shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[22px] font-semibold not-italic leading-[0] text-slate-800"
        style={{ width: 'min-content' }}
      >
        <p className="block leading-[34px]">My Orders</p>
      </div>
      <Frame10 />
    </div>
  );
}
