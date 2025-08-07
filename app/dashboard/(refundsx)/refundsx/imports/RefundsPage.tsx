import svgPaths from "./svg-f3q4pvusmy";
import imgSubtract from "figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png";

function VuesaxOutlineAdd() {
  return (
    <div className="relative size-full" data-name="vuesax/outline/add">
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
    </div>
  );
}

function VuesaxOutlineFilter() {
  return (
    <div className="relative size-full" data-name="vuesax/outline/filter">
      <div
        className="absolute contents inset-0"
        data-name="vuesax/outline/filter"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <g id="filter">
            <path
              d={svgPaths.p28b78e00}
              fill="var(--fill-0, #1E293B)"
              id="Vector"
            />
            <path
              d={svgPaths.p5802880}
              fill="var(--fill-0, #1E293B)"
              id="Vector_2"
            />
            <g id="Vector_3" opacity="0"></g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function VuesaxOutlineArrowDown() {
  return (
    <div className="relative size-full" data-name="vuesax/outline/arrow-down">
      <div
        className="absolute contents inset-0"
        data-name="vuesax/outline/arrow-down"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24 24"
        >
          <g id="arrow-down">
            <path
              d={svgPaths.p3cbdb180}
              fill="var(--fill-0, #1E293B)"
              id="Vector"
            />
            <g id="Vector_2" opacity="0"></g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[15px] items-center justify-center p-0 relative shrink-0 text-nowrap"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[28px]">
        <p className="block leading-[38px] text-nowrap whitespace-pre">
          Refunds
        </p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[18px]">
        <p className="block leading-[28px] text-nowrap whitespace-pre">
          Refunds (Transactions)
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800"
      data-name="Text"
    >
      <Text />
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[18px] w-[1374px]">
        <p className="block leading-[28px]">{`Track Refunds & Requests across all services`}</p>
      </div>
    </div>
  );
}

function VuesaxOutlineAdd1() {
  return (
    <div className="absolute bg-[#161629] h-2.5 left-0 top-[937px] w-[235px]" />
  );
}

function Button() {
  return (
    <div
      className="bg-indigo-800 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[30px] py-2.5 relative rounded-[10px] shrink-0"
      data-name="Button"
    >
      <div className="relative shrink-0 size-6" data-name="vuesax/outline/add">
        <VuesaxOutlineAdd />
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">Request Refund</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-[30px] items-center justify-start left-[255px] p-0 top-[110px]"
      data-name="Title"
    >
      <Text1 />
      <Button />
    </div>
  );
}

function Text2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-[1270px]">
        <p className="block leading-[26px]">Total Amount</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[28px] w-[1270px]">
        <p className="block leading-[38px]">$950.00</p>
      </div>
    </div>
  );
}

function Filter1() {
  return (
    <div
      className="bg-neutral-50 box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative rounded-[10px] shrink-0"
      data-name="Filter"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div
        className="relative shrink-0 size-6"
        data-name="vuesax/outline/filter"
      >
        <VuesaxOutlineFilter />
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[18px] text-left text-nowrap text-slate-800">
        <p className="block leading-[28px] whitespace-pre">Pending</p>
      </div>
      <div
        className="relative shrink-0 size-6"
        data-name="vuesax/outline/arrow-down"
      >
        <VuesaxOutlineArrowDown />
      </div>
    </div>
  );
}

function SearchBy() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0"
      data-name="Search By"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[18px] text-left text-nowrap text-slate-800">
        <p className="block leading-[28px] whitespace-pre">Search By</p>
      </div>
      <Filter1 />
    </div>
  );
}

function Card() {
  return (
    <div
      className="absolute bg-[#ffffff] box-border content-stretch flex flex-row gap-[30px] items-center justify-start left-[255px] p-[30px] rounded-[20px] top-[211px]"
      data-name="Card"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Text2 />
      <SearchBy />
    </div>
  );
}

function Title1() {
  return (
    <div
      className="bg-neutral-50 relative rounded-tl-[20px] rounded-tr-[20px] shrink-0 w-full"
      data-name="Title"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-tl-[20px] rounded-tr-[20px]"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row font-['Inter:Semi_Bold',_sans-serif] font-semibold gap-[30px] items-center justify-start leading-[0] not-italic p-[30px] relative text-[18px] text-left text-slate-800 w-full">
          <div className="relative shrink-0 w-[291px]">
            <p className="block leading-[28px]">Refund ID</p>
          </div>
          <div className="relative shrink-0 w-[291px]">
            <p className="block leading-[28px]">Order ID</p>
          </div>
          <div className="relative shrink-0 w-[291px]">
            <p className="block leading-[28px]">Amount (USD)</p>
          </div>
          <div className="relative shrink-0 w-[290px]">
            <p className="block leading-[28px]">Status</p>
          </div>
          <div className="relative shrink-0 w-[291px]">
            <p className="block leading-[28px]">Service Type</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div
      className="bg-[rgba(34,197,94,0.1)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-2.5 py-0 relative rounded-3xl shrink-0"
      data-name="Tag"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-green-500 text-left text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Approved</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-[291px]">
      <Tag />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Card - 1"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#REF-2025-001</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#ORD-2025-001</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">$150.00</p>
      </div>
      <Frame16 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[24px]">Buy from Chinese Websites</p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div
      className="bg-[rgba(255,193,7,0.1)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-2.5 py-0 relative rounded-3xl shrink-0"
      data-name="Tag"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffc107] text-[16px] text-left text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Pending</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-[291px]">
      <Tag1 />
    </div>
  );
}

function Card2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Card - 2"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#REF-2025-002</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#ORD-2025-002</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">$200.00</p>
      </div>
      <Frame17 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[24px]">{`Buy Phones & Laptops`}</p>
      </div>
    </div>
  );
}

function Tag2() {
  return (
    <div
      className="bg-[rgba(242,68,68,0.1)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-2.5 py-0 relative rounded-3xl shrink-0"
      data-name="Tag"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#f24444] text-[16px] text-left text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Rejected</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-[291px]">
      <Tag2 />
    </div>
  );
}

function Card3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Card - 3"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#REF-2025-003</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#ORD-2025-003</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">$75.00</p>
      </div>
      <Frame18 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[24px]">Special Sourcing</p>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div
      className="bg-[rgba(34,197,94,0.1)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-2.5 py-0 relative rounded-3xl shrink-0"
      data-name="Tag"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-green-500 text-left text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Approved</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-[291px]">
      <Tag3 />
    </div>
  );
}

function Card4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Card - 4"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#REF-2025-004</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#ORD-2025-004</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">$300.00</p>
      </div>
      <Frame19 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[24px]">Buy from Chinese Websites</p>
      </div>
    </div>
  );
}

function Tag4() {
  return (
    <div
      className="bg-[rgba(255,193,7,0.1)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-2.5 py-0 relative rounded-3xl shrink-0"
      data-name="Tag"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffc107] text-[16px] text-left text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Pending</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-[291px]">
      <Tag4 />
    </div>
  );
}

function Card5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Card - 5"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#REF-2025-005</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#ORD-2025-005</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">$125.00</p>
      </div>
      <Frame20 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[24px]">{`Buy Phones & Laptops`}</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="bg-[rgba(242,68,68,0.1)] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-2.5 py-0 relative rounded-3xl shrink-0"
      data-name="Tag"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#f24444] text-[16px] text-left text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Rejected</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="box-border content-stretch flex flex-row gap-px items-center justify-start p-0 relative shrink-0 w-[291px]">
      <Tag5 />
    </div>
  );
}

function Card6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Card - 6"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#REF-2025-006</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">#ORD-2025-006</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[26px]">$100.00</p>
      </div>
      <Frame21 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[291px]">
        <p className="block leading-[24px]">{`Buy Phones & Laptops`}</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[30px] relative shrink-0"
      data-name="Content"
    >
      <div
        aria-hidden="true"
        className="absolute border-[0px_1px_1px] border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none"
      />
      <Card1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1575 1"
          >
            <line
              id="Line"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1575"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Card2 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1575 1"
          >
            <line
              id="Line"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1575"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Card3 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1575 1"
          >
            <line
              id="Line"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1575"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Card4 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1575 1"
          >
            <line
              id="Line"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1575"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Card5 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1575 1"
          >
            <line
              id="Line"
              stroke="var(--stroke-0, black)"
              strokeOpacity="0.1"
              x2="1575"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
      <Card6 />
    </div>
  );
}

function Group() {
  return (
    <div
      className="absolute bottom-[0.03%] left-[21.9%] right-[21.88%] top-[0.02%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 16"
      >
        <g id="Group">
          <path
            d={svgPaths.p27f56400}
            fill="var(--fill-0, #3730A3)"
            fillOpacity="0.6"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="overflow-clip relative size-4" data-name="Frame">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div
      className="absolute bottom-[0.03%] left-[21.9%] right-[21.88%] top-[0.02%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 16"
      >
        <g id="Group">
          <path
            d={svgPaths.p27f56400}
            fill="var(--fill-0, #3730A3)"
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
      className="[grid-area:1_/_1] ml-72 mt-3.5 overflow-clip relative size-4"
      data-name="Frame"
    >
      <Group1 />
    </div>
  );
}

function Group1321315000() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-[#ffffff] h-11 ml-0 mt-0 relative rounded-[10px] w-[314px]">
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]"
        />
      </div>
      <div className="[grid-area:1_/_1] flex h-[30px] items-center justify-center ml-[39px] mt-[7px] relative w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[30px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 1"
              >
                <line
                  id="Line 194"
                  stroke="var(--stroke-0, #3730A3)"
                  strokeOpacity="0.1"
                  x2="30"
                  y1="0.5"
                  y2="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="[grid-area:1_/_1] flex h-[30px] items-center justify-center ml-[84px] mt-[7px] relative w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[30px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 1"
              >
                <line
                  id="Line 194"
                  stroke="var(--stroke-0, #3730A3)"
                  strokeOpacity="0.1"
                  x2="30"
                  y1="0.5"
                  y2="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="[grid-area:1_/_1] flex h-[30px] items-center justify-center ml-[131px] mt-[7px] relative w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[30px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 1"
              >
                <line
                  id="Line 194"
                  stroke="var(--stroke-0, #3730A3)"
                  strokeOpacity="0.1"
                  x2="30"
                  y1="0.5"
                  y2="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="[grid-area:1_/_1] flex h-[30px] items-center justify-center ml-[179px] mt-[7px] relative w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[30px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 1"
              >
                <line
                  id="Line 194"
                  stroke="var(--stroke-0, #3730A3)"
                  strokeOpacity="0.1"
                  x2="30"
                  y1="0.5"
                  y2="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="[grid-area:1_/_1] flex h-[30px] items-center justify-center ml-[229px] mt-[7px] relative w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[30px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 1"
              >
                <line
                  id="Line 194"
                  stroke="var(--stroke-0, #3730A3)"
                  strokeOpacity="0.1"
                  x2="30"
                  y1="0.5"
                  y2="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="[grid-area:1_/_1] flex h-[30px] items-center justify-center ml-[275px] mt-[7px] relative w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[30px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 1"
              >
                <line
                  id="Line 194"
                  stroke="var(--stroke-0, #3730A3)"
                  strokeOpacity="0.1"
                  x2="30"
                  y1="0.5"
                  y2="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="[grid-area:1_/_1] flex items-center justify-center ml-2.5 mt-3.5 relative size-4">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Frame />
        </div>
      </div>
      <Frame1 />
      <div className="[grid-area:1_/_1] font-['Inter:Medium',_sans-serif] font-medium leading-[0] ml-[52px] mt-3 not-italic relative text-[16px] text-indigo-800 text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">01</p>
      </div>
      <div className="[grid-area:1_/_1] font-['Inter:Regular',_sans-serif] font-normal leading-[0] ml-[97px] mt-3 not-italic relative text-[16px] text-[rgba(55,48,163,0.5)] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">02</p>
      </div>
      <div className="[grid-area:1_/_1] font-['Inter:Regular',_sans-serif] font-normal leading-[0] ml-36 mt-3 not-italic relative text-[16px] text-[rgba(55,48,163,0.5)] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">03</p>
      </div>
      <div className="[grid-area:1_/_1] font-['Inter:Regular',_sans-serif] font-normal leading-[0] ml-[242px] mt-3 not-italic relative text-[16px] text-[rgba(55,48,163,0.5)] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">07</p>
      </div>
      <div className="[grid-area:1_/_1] font-['Inter:Regular',_sans-serif] font-normal leading-[0] ml-48 mt-3 not-italic relative text-[16px] text-[rgba(55,48,163,0.5)] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">.....</p>
      </div>
    </div>
  );
}

function Pegination() {
  return (
    <div
      className="bg-neutral-50 relative rounded-bl-[20px] rounded-br-[20px] shrink-0 w-full"
      data-name="Pegination"
    >
      <div
        aria-hidden="true"
        className="absolute border-[0px_1px_1px] border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-bl-[20px] rounded-br-[20px]"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start leading-[0] p-[30px] relative w-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal not-italic relative shrink-0 text-[16px] text-left text-slate-800 w-[1230px]">
            <p className="block leading-[26px]">Showing 6 of 150 Refunds</p>
          </div>
          <Group1321315000 />
        </div>
      </div>
    </div>
  );
}

function Table() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-[255px] p-0 top-[370px]"
      data-name="Table"
    >
      <Title1 />
      <Content />
      <Pegination />
    </div>
  );
}

export default function RefundsPage() {
  return (
    <div className="bg-slate-50 relative size-full" data-name="Refunds Page">
      <VuesaxOutlineAdd1 />
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
      <Title />
      <Card />
      <Table />
    </div>
  );
}