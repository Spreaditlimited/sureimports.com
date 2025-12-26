import svgPaths from './svg-yux5hd1wil';
import imgSubtract from 'figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png';

function VuesaxOutlineAdd() {
  return (
    <div className="relative size-full" data-name="vuesax/outline/add">
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
    </div>
  );
}

function VuesaxOutlineFilter() {
  return (
    <div className="relative size-full" data-name="vuesax/outline/filter">
      <div
        className="absolute inset-0 contents"
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
        className="absolute inset-0 contents"
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
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-[15px] text-nowrap p-0"
      data-name="Text"
    >
      <div className="relative shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[28px] font-semibold">
        <p className="block whitespace-pre text-nowrap leading-[38px]">
          Refunds
        </p>
      </div>
      <div className="relative shrink-0 font-['Inter:Regular',_sans-serif] text-[18px] font-normal">
        <p className="block whitespace-pre text-nowrap leading-[28px]">
          Refunds (Transactions)
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <Text />
      <div className="relative w-[1374px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold">
        <p className="block leading-[28px]">{`Track Refunds & Requests across all services`}</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-indigo-800 px-[30px] py-2.5"
      data-name="Button"
    >
      <div className="relative size-6 shrink-0" data-name="vuesax/outline/add">
        <VuesaxOutlineAdd />
      </div>
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-[#ffffff]">
        <p className="block whitespace-pre leading-[28px]">Request Refund</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div
      className="absolute left-[255px] top-[110px] box-border flex flex-row content-stretch items-center justify-start gap-[30px] p-0"
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-[5px] p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-[1270px] shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal">
        <p className="block leading-[26px]">Total Amount</p>
      </div>
      <div className="relative w-[1270px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[28px] font-semibold">
        <p className="block leading-[38px]">$950.00</p>
      </div>
    </div>
  );
}

function Filter1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-neutral-50 px-5 py-2.5"
      data-name="Filter"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div
        className="relative size-6 shrink-0"
        data-name="vuesax/outline/filter"
      >
        <VuesaxOutlineFilter />
      </div>
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[28px]">Pending</p>
      </div>
      <div
        className="relative size-6 shrink-0"
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
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 p-0"
      data-name="Search By"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[18px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[28px]">Search By</p>
      </div>
      <Filter1 />
    </div>
  );
}

function Card() {
  return (
    <div
      className="absolute left-[255px] top-[211px] box-border flex flex-row content-stretch items-center justify-start gap-[30px] rounded-[20px] bg-[#ffffff] p-[30px]"
      data-name="Card"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Text2 />
      <SearchBy />
    </div>
  );
}

function Title1() {
  return (
    <div
      className="relative w-full shrink-0 rounded-tl-[20px] rounded-tr-[20px] bg-neutral-50"
      data-name="Title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-tl-[20px] rounded-tr-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative flex size-full flex-row items-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-start gap-[30px] p-[30px] text-left font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[0] text-slate-800">
          <div className="relative w-[291px] shrink-0">
            <p className="block leading-[28px]">Refund ID</p>
          </div>
          <div className="relative w-[291px] shrink-0">
            <p className="block leading-[28px]">Order ID</p>
          </div>
          <div className="relative w-[291px] shrink-0">
            <p className="block leading-[28px]">Amount (USD)</p>
          </div>
          <div className="relative w-[290px] shrink-0">
            <p className="block leading-[28px]">Status</p>
          </div>
          <div className="relative w-[291px] shrink-0">
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
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-3xl bg-[rgba(34,197,94,0.1)] px-2.5 py-0"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-green-500">
        <p className="block whitespace-pre leading-[26px]">Approved</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative box-border flex w-[291px] shrink-0 flex-row content-stretch items-center justify-start gap-px p-0">
      <Tag />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Card - 1"
    >
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#REF-2025-001</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#ORD-2025-001</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">$150.00</p>
      </div>
      <Frame16 />
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Buy from Chinese Websites</p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-3xl bg-[rgba(255,193,7,0.1)] px-2.5 py-0"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#ffc107]">
        <p className="block whitespace-pre leading-[26px]">Pending</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative box-border flex w-[291px] shrink-0 flex-row content-stretch items-center justify-start gap-px p-0">
      <Tag1 />
    </div>
  );
}

function Card2() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Card - 2"
    >
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#REF-2025-002</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#ORD-2025-002</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">$200.00</p>
      </div>
      <Frame17 />
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">{`Buy Phones & Laptops`}</p>
      </div>
    </div>
  );
}

function Tag2() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-3xl bg-[rgba(242,68,68,0.1)] px-2.5 py-0"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#f24444]">
        <p className="block whitespace-pre leading-[26px]">Rejected</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative box-border flex w-[291px] shrink-0 flex-row content-stretch items-center justify-start gap-px p-0">
      <Tag2 />
    </div>
  );
}

function Card3() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Card - 3"
    >
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#REF-2025-003</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#ORD-2025-003</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">$75.00</p>
      </div>
      <Frame18 />
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Special Sourcing</p>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-3xl bg-[rgba(34,197,94,0.1)] px-2.5 py-0"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-green-500">
        <p className="block whitespace-pre leading-[26px]">Approved</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="relative box-border flex w-[291px] shrink-0 flex-row content-stretch items-center justify-start gap-px p-0">
      <Tag3 />
    </div>
  );
}

function Card4() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Card - 4"
    >
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#REF-2025-004</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#ORD-2025-004</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">$300.00</p>
      </div>
      <Frame19 />
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">Buy from Chinese Websites</p>
      </div>
    </div>
  );
}

function Tag4() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-3xl bg-[rgba(255,193,7,0.1)] px-2.5 py-0"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#ffc107]">
        <p className="block whitespace-pre leading-[26px]">Pending</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative box-border flex w-[291px] shrink-0 flex-row content-stretch items-center justify-start gap-px p-0">
      <Tag4 />
    </div>
  );
}

function Card5() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Card - 5"
    >
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#REF-2025-005</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#ORD-2025-005</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">$125.00</p>
      </div>
      <Frame20 />
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">{`Buy Phones & Laptops`}</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 rounded-3xl bg-[rgba(242,68,68,0.1)] px-2.5 py-0"
      data-name="Tag"
    >
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[#f24444]">
        <p className="block whitespace-pre leading-[26px]">Rejected</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="relative box-border flex w-[291px] shrink-0 flex-row content-stretch items-center justify-start gap-px p-0">
      <Tag5 />
    </div>
  );
}

function Card6() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Card - 6"
    >
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#REF-2025-006</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">#ORD-2025-006</p>
      </div>
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-slate-800">
        <p className="block leading-[26px]">$100.00</p>
      </div>
      <Frame21 />
      <div className="relative w-[291px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-slate-800">
        <p className="block leading-[24px]">{`Buy Phones & Laptops`}</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-5 bg-[#ffffff] p-[30px]"
      data-name="Content"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-solid border-[0px_1px_1px] border-[rgba(0,0,0,0.05)]"
      />
      <Card1 />
      <div className="relative h-0 w-full shrink-0" data-name="Line">
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
      <div className="relative h-0 w-full shrink-0" data-name="Line">
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
      <div className="relative h-0 w-full shrink-0" data-name="Line">
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
      <div className="relative h-0 w-full shrink-0" data-name="Line">
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
      <div className="relative h-0 w-full shrink-0" data-name="Line">
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
    <div className="relative size-4 overflow-clip" data-name="Frame">
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
      className="relative ml-72 mt-3.5 size-4 overflow-clip [grid-area:1_/_1]"
      data-name="Frame"
    >
      <Group1 />
    </div>
  );
}

function Group1321315000() {
  return (
    <div className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start">
      <div className="relative ml-0 mt-0 h-11 w-[314px] rounded-[10px] bg-[#ffffff] [grid-area:1_/_1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div className="relative ml-[39px] mt-[7px] flex h-[30px] w-[0px] items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[90deg]">
          <div className="relative h-0 w-[30px]">
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
      <div className="relative ml-[84px] mt-[7px] flex h-[30px] w-[0px] items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[90deg]">
          <div className="relative h-0 w-[30px]">
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
      <div className="relative ml-[131px] mt-[7px] flex h-[30px] w-[0px] items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[90deg]">
          <div className="relative h-0 w-[30px]">
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
      <div className="relative ml-[179px] mt-[7px] flex h-[30px] w-[0px] items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[90deg]">
          <div className="relative h-0 w-[30px]">
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
      <div className="relative ml-[229px] mt-[7px] flex h-[30px] w-[0px] items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[90deg]">
          <div className="relative h-0 w-[30px]">
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
      <div className="relative ml-[275px] mt-[7px] flex h-[30px] w-[0px] items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[90deg]">
          <div className="relative h-0 w-[30px]">
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
      <div className="relative ml-2.5 mt-3.5 flex size-4 items-center justify-center [grid-area:1_/_1]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Frame />
        </div>
      </div>
      <Frame1 />
      <div className="relative ml-[52px] mt-3 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-indigo-800 [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[normal]">01</p>
      </div>
      <div className="relative ml-[97px] mt-3 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[rgba(55,48,163,0.5)] [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[normal]">02</p>
      </div>
      <div className="relative ml-36 mt-3 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[rgba(55,48,163,0.5)] [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[normal]">03</p>
      </div>
      <div className="relative ml-[242px] mt-3 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[rgba(55,48,163,0.5)] [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[normal]">07</p>
      </div>
      <div className="relative ml-48 mt-3 text-nowrap text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic leading-[0] text-[rgba(55,48,163,0.5)] [grid-area:1_/_1]">
        <p className="block whitespace-pre leading-[normal]">.....</p>
      </div>
    </div>
  );
}

function Pegination() {
  return (
    <div
      className="relative w-full shrink-0 rounded-bl-[20px] rounded-br-[20px] bg-neutral-50"
      data-name="Pegination"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-bl-[20px] rounded-br-[20px] border-solid border-[0px_1px_1px] border-[rgba(0,0,0,0.05)]"
      />
      <div className="relative flex size-full flex-row items-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-start gap-[30px] p-[30px] leading-[0]">
          <div className="relative w-[1230px] shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[16px] font-normal not-italic text-slate-800">
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
      className="absolute left-[255px] top-[370px] box-border flex flex-col content-stretch items-start justify-start p-0"
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
    <div className="relative size-full bg-slate-50" data-name="Refunds Page">
      <div className="absolute left-0 top-[937px] h-2.5 w-[235px] bg-[#161629]" />
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
      <Title />
      <Card />
      <Table />
    </div>
  );
}
