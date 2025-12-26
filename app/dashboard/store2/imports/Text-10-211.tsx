import svgPaths from './svg-f4xdchptqj';
import imgImage14 from 'figma:asset/5b6f4bbdab7c47655211170a7ebc9dd2b6e1272f.png';
import imgImage11 from 'figma:asset/9624e54c7174fd81a33c10142056073f6d62d55d.png';
import { imgImage15, imgGroup, imgGroup1 } from './svg-fc9ff';

function Text() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0"
      data-name="Text"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[22px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[34px]">Shopping Cart</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Title"
    >
      <Text />
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
        className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-1px] mask-size-[145px_145px] ml-[-16px] mt-px h-[145px] w-[178px] bg-cover bg-center bg-no-repeat [grid-area:1_/_1]"
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
      <div className="relative ml-0 mt-0 size-[145px] rounded-[10px] bg-neutral-50 [grid-area:1_/_1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <MaskGroup />
    </div>
  );
}

function Frame42() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-[5px] p-0">
      <div className="relative w-[682px] shrink-0 font-['Inter:Medium',_sans-serif] text-[18px] font-medium">
        <p className="block leading-[26px]">HP EliteBook x360 1040 G8</p>
      </div>
      <div className="relative w-[682px] shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal">
        <p className="block leading-[24px]">Color : Gray</p>
      </div>
      <div className="relative w-[682px] shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal">
        <p className="block leading-[24px]">Brand : HP</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-[15px] p-0 text-left not-italic leading-[0] text-slate-800">
      <Frame42 />
      <div className="relative w-[682px] shrink-0 font-['Inter:Regular',_sans-serif] text-[0px] font-normal">
        <p>
          <span className="text-[18px] leading-[26px]">{`Price : `}</span>
          <span className="font-['Inter:Medium',_sans-serif] text-[20px] font-medium not-italic leading-[30px]">
            ₦19,35,000.00
          </span>
        </p>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[15px] p-0">
      <Image />
      <Frame43 />
    </div>
  );
}

function Group() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.871px_-1.042px] mask-size-[20px_20px] absolute inset-[5.21%_9.4%_5.21%_9.36%]"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative size-5 shrink-0 overflow-clip" data-name="Frame">
      <ClipPathGroup />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-5 rounded-[10px] bg-[rgba(242,68,68,0.3)] p-[10px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(242,68,68,0.3)]"
      />
      <Frame />
    </div>
  );
}

function Group1() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-12px] mask-size-[24px_24px] absolute bottom-1/2 left-1/4 right-1/4 top-1/2"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip" data-name="Frame">
      <ClipPathGroup1 />
    </div>
  );
}

function Group2() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px] mask-size-[24px_24px] absolute inset-1/4"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip" data-name="Frame">
      <ClipPathGroup2 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative h-12 w-full shrink-0 rounded-[10px] bg-[rgba(255,255,255,0)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.3)]"
      />
      <div className="relative flex size-full flex-row items-center">
        <div className="relative box-border flex h-12 w-full flex-row content-stretch items-center justify-start gap-5 px-[15px] py-3">
          <Frame1 />
          <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
            <p className="block whitespace-pre leading-[24px]">2</p>
          </div>
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="relative box-border flex w-32 shrink-0 flex-col content-stretch items-end justify-start gap-[57px] p-0">
      <Frame15 />
      <Frame14 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="relative box-border flex w-[990px] shrink-0 flex-row content-stretch items-center justify-between p-0">
      <Frame45 />
      <Frame44 />
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
        className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-5px] mask-size-[145px_145px] ml-0 mt-[5px] h-[124px] w-[130px] bg-cover bg-center bg-no-repeat [grid-area:1_/_1]"
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
      <div className="relative ml-0 mt-0 size-[145px] rounded-[10px] bg-neutral-50 [grid-area:1_/_1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <MaskGroup1 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-[5px] p-0">
      <div className="relative w-[682px] shrink-0 font-['Inter:Medium',_sans-serif] text-[18px] font-medium">
        <p className="block leading-[26px]">{`MacBook Air 13.6" M2 Chip 8GB 512GB`}</p>
      </div>
      <div
        className="relative min-w-full shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal"
        style={{ width: 'min-content' }}
      >
        <p className="block leading-[24px]">Color : Gray</p>
      </div>
      <div
        className="relative min-w-full shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal"
        style={{ width: 'min-content' }}
      >
        <p className="block leading-[24px]">Brand : Apple</p>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-[15px] p-0 text-left not-italic leading-[0] text-slate-800">
      <Frame48 />
      <div className="relative shrink-0 text-nowrap font-['Inter:Regular',_sans-serif] text-[0px] font-normal">
        <p className="whitespace-pre">
          <span className="text-[18px] leading-[26px]">{`Price : `}</span>
          <span className="font-['Inter:Medium',_sans-serif] text-[20px] font-medium not-italic leading-[30px]">
            ₦1,147,500.00
          </span>
        </p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[15px] p-0">
      <Image1 />
      <Frame49 />
    </div>
  );
}

function Group3() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.871px_-1.042px] mask-size-[20px_20px] absolute inset-[5.21%_9.4%_5.21%_9.36%]"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative size-5 shrink-0 overflow-clip" data-name="Frame">
      <ClipPathGroup3 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-5 rounded-[10px] bg-[rgba(242,68,68,0.3)] p-[10px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(242,68,68,0.3)]"
      />
      <Frame3 />
    </div>
  );
}

function Group4() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px_-12px] mask-size-[24px_24px] absolute bottom-1/2 left-1/4 right-1/4 top-1/2"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip" data-name="Frame">
      <ClipPathGroup4 />
    </div>
  );
}

function Group5() {
  return (
    <div
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6px] mask-size-[24px_24px] absolute inset-1/4"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip" data-name="Frame">
      <ClipPathGroup5 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative h-12 w-full shrink-0 rounded-[10px] bg-[rgba(255,255,255,0)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.3)]"
      />
      <div className="relative flex size-full flex-row items-center">
        <div className="relative box-border flex h-12 w-full flex-row content-stretch items-center justify-start gap-5 px-[15px] py-3">
          <Frame4 />
          <div className="relative shrink-0 text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold not-italic leading-[0] text-slate-800">
            <p className="block whitespace-pre leading-[24px]">1</p>
          </div>
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="relative box-border flex w-32 shrink-0 flex-col content-stretch items-end justify-start gap-[57px] p-0">
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="relative box-border flex w-[990px] shrink-0 flex-row content-stretch items-center justify-between p-0">
      <Frame50 />
      <Frame51 />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-5 rounded-[20px] bg-[#ffffff] p-[30px]"
      data-name="Card -1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative w-[990px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[20px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[30px]">Ordered Item’s :</p>
      </div>
      <div className="relative h-0 w-[990px] shrink-0">
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
      <div className="relative h-0 w-[990px] shrink-0">
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
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-[30px] p-0">
      <Card1 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-start gap-5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800">
      <div className="relative w-[355px] shrink-0 font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block leading-[24px]">Subtotal :</p>
      </div>
      <div className="relative w-[120px] shrink-0 font-['Inter:Medium',_sans-serif] font-medium">
        <p className="block leading-[24px]">₦30,32,500.00</p>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-start gap-5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800">
      <div className="relative w-[355px] shrink-0 font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block leading-[24px]">Shipping Charge’s :</p>
      </div>
      <div className="relative w-[120px] shrink-0 font-['Inter:Medium',_sans-serif] font-medium">
        <p className="block leading-[24px]">₦1,000.00</p>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-start gap-5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800">
      <div className="relative w-[355px] shrink-0 font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block leading-[24px]">{`Tax : `}</p>
      </div>
      <div className="relative w-[120px] shrink-0 font-['Inter:Medium',_sans-serif] font-medium">
        <p className="block leading-[24px]">₦2,500.00</p>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-[15px] p-0">
      <Frame38 />
      <Frame39 />
      <Frame40 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-start gap-5 p-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[20px] font-semibold not-italic leading-[0] text-slate-800">
      <div className="relative w-[301px] shrink-0">
        <p className="block leading-[30px]">Total :</p>
      </div>
      <div className="relative w-[174px] shrink-0">
        <p className="block leading-[30px]">₦30,36,000.00</p>
      </div>
    </div>
  );
}

function VuesaxOutlineArrowRight() {
  return (
    <div
      className="absolute inset-0 contents"
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
      className="relative size-6 shrink-0"
      data-name="vuesax/outline/arrow-right"
    >
      <VuesaxOutlineArrowRight />
    </div>
  );
}

function Button() {
  return (
    <div
      className="relative ml-[355px] mt-0.5 box-border flex flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-indigo-800 px-[30px] py-2.5 [grid-area:1_/_1]"
      data-name="Button"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[24px]">Apply</p>
      </div>
      <VuesaxOutlineArrowRight1 />
    </div>
  );
}

function VuesaxOutlineDiscountShape() {
  return (
    <div
      className="absolute inset-0 contents"
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
      className="relative ml-[15px] mt-3 size-6 [grid-area:1_/_1]"
      data-name="vuesax/outline/discount-shape"
    >
      <VuesaxOutlineDiscountShape />
    </div>
  );
}

function Group1321315010() {
  return (
    <div className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
      <div className="relative ml-0 mt-0 h-12 w-[495px] rounded-[10px] bg-[#ffffff] [grid-area:1_/_1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.1)]"
        />
      </div>
      <Button />
      <VuesaxOutlineDiscountShape1 />
      <div className="relative ml-[49px] mt-3 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic text-[rgba(30,41,59,0.7)] [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[24px]">Add Promo Code</p>
      </div>
    </div>
  );
}

function VuesaxOutlineArrowRight2() {
  return (
    <div
      className="absolute inset-0 contents"
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
      className="relative size-6 shrink-0"
      data-name="vuesax/outline/arrow-right"
    >
      <VuesaxOutlineArrowRight2 />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-[10px] bg-indigo-800"
      data-name="Button"
    >
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-[30px] py-2.5">
          <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-[#ffffff]">
            <p className="block whitespace-pre leading-[28px]">Checkout Now</p>
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-5 rounded-[20px] bg-[#ffffff] p-[30px]"
      data-name="Card -1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div
        className="relative min-w-full shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[24px] font-semibold not-italic leading-[0] text-slate-800"
        style={{ width: 'min-content' }}
      >
        <p className="block leading-[34px]">Order Summary</p>
      </div>
      <div className="relative h-0 w-[495px] shrink-0">
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
      <div className="relative h-0 w-[495px] shrink-0">
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
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-[30px] p-0">
      <Card2 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-start gap-[30px] p-0">
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function VuesaxOutlineCloseCircle() {
  return (
    <div
      className="absolute inset-0 contents"
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
      className="relative size-6 shrink-0"
      data-name="vuesax/outline/close-circle"
    >
      <VuesaxOutlineCloseCircle />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-slate-600 px-[30px] py-2.5"
      data-name="Button"
    >
      <VuesaxOutlineCloseCircle1 />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[28px]">Clear Cart</p>
      </div>
    </div>
  );
}

export default function Text1() {
  return (
    <div
      className="relative box-border flex size-full flex-col content-stretch items-start justify-start gap-5 p-0"
      data-name="Text"
    >
      <Title />
      <Frame37 />
      <Button2 />
    </div>
  );
}
