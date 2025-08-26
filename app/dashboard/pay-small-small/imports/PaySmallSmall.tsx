import svgPaths from "./svg-vry8tcjx11";
import imgImage from "figma:asset/f92fee668398ade3037049641a93d24fd459fa68.png";
import imgImage2 from "figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png";
import imgAdobeExpressFile41 from "figma:asset/de3ce56cf2aad05726683d46c461a21611e2b82b.png";
import imgImage3 from "figma:asset/ea715f49495dbfc812bf1773fc538cb0cbd3f088.png";
import imgSubtract from "figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png";
import { imgImage1, imgGroup } from "./svg-2dlsy";

function VuesaxOutlineArrowDown() {
  return (
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
            fill="var(--fill-0, #3730A3)"
            id="Vector"
          />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineArrowDown1() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/arrow-down"
    >
      <VuesaxOutlineArrowDown />
    </div>
  );
}

function Filter() {
  return (
    <div
      className="bg-[rgba(55,48,163,0.05)] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative rounded-[10px] shrink-0"
      data-name="Filter"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(55,48,163,0.7)] border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[18px] text-indigo-800 text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">Saved Product</p>
      </div>
      <VuesaxOutlineArrowDown1 />
    </div>
  );
}

function Title() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-5 items-center justify-start left-64 p-0 top-[380px]"
      data-name="Title"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[20px] text-left text-slate-800 w-[1414px]">
        <p className="block leading-[30px]">Saved Product</p>
      </div>
      <Filter />
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
        className="[grid-area:1_/_1] bg-neutral-50 h-[200px] ml-0 mt-0 relative rounded-[20px] w-[353px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
      <div
        className="[grid-area:1_/_1] bg-[54.63%_47.35%] bg-no-repeat bg-size-[116.07%_185.27%] h-40 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-20px] mask-size-[353px_200px] ml-[46px] mt-5 w-[255px]"
        data-name="Image"
        style={{
          backgroundImage: `url('${imgImage}')`,
          maskImage: `url('${imgImage1}')`,
        }}
      />
    </div>
  );
}

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800 w-full"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-full">
        <p className="block leading-[26px]">{`MacBook Air 13.3" (2015, i5, 4GB RAM, 128GB SSD) – Classic Mac, Ultra Portable`}</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-full">
        <p className="block leading-[26px]">₦378,000.00</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[14px] w-full">
        <p className="block leading-[24px]">
          Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)
        </p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div
      className="absolute inset-[5.208%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p1ce82000}
            fill="var(--fill-0, #3730A3)"
            id="Vector"
          />
          <path
            d={svgPaths.p25628e20}
            fill="var(--fill-0, #3730A3)"
            id="Vector_2"
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
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <ClipPathGroup />
    </div>
  );
}

function CheckBox() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[5px] items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Check Box"
    >
      <Frame />
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-left text-slate-800">
        <p className="block leading-[24px]">
          Check this box to Activate / Cancel your product
        </p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="bg-indigo-800 relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center">
            <p className="block leading-[26px]">Activate Pay Small Small</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-gray-400 border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-center text-gray-400">
            <p className="block leading-[26px]">Cancel PSS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Button"
    >
      <Button />
      <Button1 />
    </div>
  );
}

function Text1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[15px] items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <Text />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-full">
        <p className="block leading-[24px]">
          A perfect entry-level MacBook for students, writers, and everyday
          users. The 2015 MacBook Air...
        </p>
      </div>
      <CheckBox />
      <Button2 />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[20px] relative rounded-[20px] shrink-0"
      data-name="Card - 1"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Image />
      <Text1 />
    </div>
  );
}

function Image1() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div
        className="[grid-area:1_/_1] bg-neutral-50 h-[200px] ml-0 mt-0 relative rounded-[20px] w-[353px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
      <div
        className="[grid-area:1_/_1] bg-[100%_49.4%] bg-no-repeat bg-size-[101.62%_159.91%] h-40 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-85px_-20px] mask-size-[353px_200px] ml-[85px] mt-5 w-[184px]"
        data-name="Image"
        style={{
          backgroundImage: `url('${imgImage2}')`,
          maskImage: `url('${imgImage1}')`,
        }}
      />
    </div>
  );
}

function Text2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800 w-full"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-full">
        <p className="block leading-[26px]">
          HP EliteBook x360 1040 G8 – Power Meets Elegance
        </p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-full">
        <p className="block leading-[26px]">₦1,015,875.00</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[14px] w-full">
        <p className="block leading-[24px]">
          Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)
        </p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div
      className="absolute inset-[5.208%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p1ce82000}
            fill="var(--fill-0, #3730A3)"
            id="Vector"
          />
          <path
            d={svgPaths.p25628e20}
            fill="var(--fill-0, #3730A3)"
            id="Vector_2"
          />
        </g>
      </svg>
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
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <ClipPathGroup1 />
    </div>
  );
}

function CheckBox1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[5px] items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Check Box"
    >
      <Frame1 />
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-left text-slate-800">
        <p className="block leading-[24px]">
          Check this box to Activate / Cancel your product
        </p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="bg-indigo-800 relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center">
            <p className="block leading-[26px]">Activate Pay Small Small</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-gray-400 border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-center text-gray-400">
            <p className="block leading-[26px]">Cancel PSS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Button"
    >
      <Button3 />
      <Button4 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[15px] items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <Text2 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-full">
        <p className="block leading-[24px]">
          Experience elite performance in a sleek, convertible design with the
          HP EliteBook...
        </p>
      </div>
      <CheckBox1 />
      <Button5 />
    </div>
  );
}

function Card2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[20px] relative rounded-[20px] shrink-0"
      data-name="Card - 2"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Image1 />
      <Text3 />
    </div>
  );
}

function Image2() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div
        className="[grid-area:1_/_1] bg-neutral-50 h-[200px] ml-0 mt-0 relative rounded-[20px] w-[353px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
      <div
        className="[grid-area:1_/_1] bg-center bg-no-repeat bg-size-[146.55%_112.68%] h-40 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-133px_-20px] mask-size-[353px_200px] ml-[133px] mt-5 w-[88px]"
        data-name="Adobe Express - file (4) 1"
        style={{
          backgroundImage: `url('${imgAdobeExpressFile41}')`,
          maskImage: `url('${imgImage1}')`,
        }}
      />
    </div>
  );
}

function Text4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800 w-full"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-full">
        <p className="block leading-[26px]">
          iPhone 15 Pro Max – Titanium Power. Ultimate Performance. Pro Beyond.
        </p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-full">
        <p className="block leading-[26px]">₦1,299,000.00</p>
      </div>
      <div className="font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[14px] w-full">
        <p className="block leading-[24px]">
          Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)
        </p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div
      className="absolute inset-[5.208%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p1ce82000}
            fill="var(--fill-0, #3730A3)"
            id="Vector"
          />
          <path
            d={svgPaths.p25628e20}
            fill="var(--fill-0, #3730A3)"
            id="Vector_2"
          />
        </g>
      </svg>
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

function Frame3() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <ClipPathGroup2 />
    </div>
  );
}

function CheckBox2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[5px] items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Check Box"
    >
      <Frame3 />
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-left text-slate-800">
        <p className="block leading-[24px]">
          Check this box to Activate / Cancel your product
        </p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="bg-indigo-800 relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center">
            <p className="block leading-[26px]">Activate Pay Small Small</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-gray-400 border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-center text-gray-400">
            <p className="block leading-[26px]">Cancel PSS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Button"
    >
      <Button6 />
      <Button7 />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[15px] items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <Text4 />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-left text-slate-800 w-full">
        <p className="block leading-[24px]">
          Experience next-level performance with the iPhone 15 Pro Max – built
          with aerospace...
        </p>
      </div>
      <CheckBox2 />
      <Button8 />
    </div>
  );
}

function Card3() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[20px] relative rounded-[20px] shrink-0"
      data-name="Card - 3"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Image2 />
      <Text5 />
    </div>
  );
}

function Image3() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Image"
    >
      <div
        className="[grid-area:1_/_1] bg-neutral-50 h-[200px] ml-0 mt-0 relative rounded-[20px] w-[353px]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
      <div
        className="[grid-area:1_/_1] bg-[43.44%_50%] bg-no-repeat bg-size-[170.32%_112.68%] h-40 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-97px_-20px] mask-size-[353px_200px] mix-blend-darken ml-[97px] mt-5 w-[159px]"
        data-name="Image"
        style={{
          backgroundImage: `url('${imgImage3}')`,
          maskImage: `url('${imgImage1}')`,
        }}
      />
    </div>
  );
}

function Text6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5px] items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[16px] w-[355px]">
        <p className="block leading-[26px]">
          Samsung Galaxy S24 Ultra – Epic Performance. Ultra Clarity. Built to
          Lead.
        </p>
      </div>
      <div
        className="font-['Inter:Semi_Bold',_sans-serif] font-semibold min-w-full relative shrink-0 text-[16px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[26px]">₦1,179,500.00</p>
      </div>
      <div
        className="font-['Inter:Medium',_sans-serif] font-medium min-w-full relative shrink-0 text-[14px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[24px]">
          Fri Aug 01 2025 12:17:17 GMT+0100 (West Africa Standard Time)
        </p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div
      className="absolute inset-[5.208%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px]"
      data-name="Group"
      style={{ maskImage: `url('${imgGroup}')` }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 17 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p1ce82000}
            fill="var(--fill-0, #3730A3)"
            id="Vector"
          />
          <path
            d={svgPaths.p25628e20}
            fill="var(--fill-0, #3730A3)"
            id="Vector_2"
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

function Frame4() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <ClipPathGroup3 />
    </div>
  );
}

function CheckBox3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[5px] items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Check Box"
    >
      <Frame4 />
      <div className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-left text-slate-800">
        <p className="block leading-[24px]">
          Check this box to Activate / Cancel your product
        </p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="bg-indigo-800 relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center">
            <p className="block leading-[26px]">Activate Pay Small Small</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-gray-400 border-solid inset-0 pointer-events-none rounded-[10px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-5 py-2.5 relative w-full">
          <div className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-center text-gray-400">
            <p className="block leading-[26px]">Cancel PSS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Button"
    >
      <Button9 />
      <Button10 />
    </div>
  );
}

function Text7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[15px] items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Text"
    >
      <Text6 />
      <div
        className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[14px] text-left text-slate-800"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[24px]">
          Push boundaries with the Galaxy S24 Ultra – featuring a sleek armor
          aluminum body...
        </p>
      </div>
      <CheckBox3 />
      <Button11 />
    </div>
  );
}

function Card4() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[20px] relative rounded-[20px] shrink-0"
      data-name="Card - 4"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Image3 />
      <Text7 />
    </div>
  );
}

function Cards() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-5 items-center justify-start left-64 p-0 top-[458px]"
      data-name="Cards"
    >
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
    </div>
  );
}

function Text8() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Bank:</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 w-[560px]">
        <p className="block leading-[26px]">Wema Bank</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Account Name:</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 w-[508px]">
        <p className="block leading-[26px]">SUREIMPORTERS/TOCHUKWU TOCHUKWU</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Text"
    >
      <Text8 />
      <Text9 />
    </div>
  );
}

function Text11() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Account Number:</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 w-[469px]">
        <p className="block leading-[26px]">9322812663</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 h-7 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-nowrap">
        <p className="block leading-[26px] whitespace-pre">Currency:</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 w-[550px]">
        <p className="block leading-[26px]">NGN</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0"
      data-name="Text"
    >
      <Text11 />
      <Text12 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[30px] relative rounded-[20px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Text10 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-left text-slate-800"
      data-name="Text"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-[154px]">
        <p className="block leading-[26px]">Wallet Balance:</p>
      </div>
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[28px] w-[154px]">
        <p className="block leading-[38px]">₦5,250.00</p>
      </div>
    </div>
  );
}

function VuesaxOutlineWallet2() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/wallet-2"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="wallet-2">
          <path
            d={svgPaths.p19a4a480}
            fill="var(--fill-0, #AD6EED)"
            id="Vector"
          />
          <path
            d={svgPaths.p33ea4180}
            fill="var(--fill-0, #AD6EED)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p3ddf5000}
            fill="var(--fill-0, #AD6EED)"
            id="Vector_3"
          />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineWallet3() {
  return (
    <div
      className="relative shrink-0 size-6"
      data-name="vuesax/outline/wallet-2"
    >
      <VuesaxOutlineWallet2 />
    </div>
  );
}

function Icon() {
  return (
    <div
      className="bg-[rgba(173,110,237,0.1)] box-border content-stretch flex flex-row gap-2.5 items-start justify-center p-[10px] relative rounded-3xl shrink-0"
      data-name="Icon"
    >
      <VuesaxOutlineWallet3 />
    </div>
  );
}

function Text15() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-start justify-start p-[30px] relative rounded-[20px] shrink-0"
      data-name="Text"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
      />
      <Text14 />
      <Icon />
    </div>
  );
}

function Frame5() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[30px] items-center justify-start p-0 relative shrink-0 w-full">
      <Frame2 />
      <Text15 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-2.5 items-start justify-start left-64 p-0 top-[178px]">
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[18px] text-left text-slate-800 w-full">
        <p className="block leading-[28px]">Virtual Account Details</p>
      </div>
      <Frame5 />
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
      <div className="absolute bg-[#161629] h-2.5 left-0 top-[937px] w-[235px]" />
      <div className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] left-64 not-italic text-[28px] text-left text-nowrap text-slate-800 top-[110px]">
        <p className="block leading-[38px] whitespace-pre">Pay Small Small</p>
      </div>
      <Title />
      <Cards />
      <Frame6 />
    </div>
  );
}