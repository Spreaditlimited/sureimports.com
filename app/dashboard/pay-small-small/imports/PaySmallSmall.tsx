// @ts-nocheck
import svgPaths from './svg-vry8tcjx11';
import imgImage from 'figma:asset/f92fee668398ade3037049641a93d24fd459fa68.png';
import imgImage2 from 'figma:asset/27d4ec04ddb84fba75591233e680f165d5cb6726.png';
import imgAdobeExpressFile41 from 'figma:asset/de3ce56cf2aad05726683d46c461a21611e2b82b.png';
import imgImage3 from 'figma:asset/ea715f49495dbfc812bf1773fc538cb0cbd3f088.png';
import imgSubtract from 'figma:asset/4964a0ebe3d64b53b49b697a91f64216e204411f.png';
import { imgImage1, imgGroup } from './svg-2dlsy';

function VuesaxOutlineArrowDown() {
  return (
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
      className="relative size-6 shrink-0"
      data-name="vuesax/outline/arrow-down"
    >
      <VuesaxOutlineArrowDown />
    </div>
  );
}

function Filter() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 rounded-[10px] bg-[rgba(55,48,163,0.05)] px-5 py-2.5"
      data-name="Filter"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-[rgba(55,48,163,0.7)]"
      />
      <div className="relative shrink-0 text-nowrap text-left font-['Inter:Medium',_sans-serif] text-[18px] font-medium not-italic leading-[0] text-indigo-800">
        <p className="block whitespace-pre leading-[28px]">Saved Product</p>
      </div>
      <VuesaxOutlineArrowDown1 />
    </div>
  );
}

function Title() {
  return (
    <div
      className="absolute left-64 top-[380px] box-border flex flex-row content-stretch items-center justify-start gap-5 p-0"
      data-name="Title"
    >
      <div className="relative w-[1414px] shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[20px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[30px]">Saved Product</p>
      </div>
      <Filter />
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
        className="relative ml-0 mt-0 h-[200px] w-[353px] rounded-[20px] bg-neutral-50 [grid-area:1_/_1]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div
        className="bg-size-[116.07%_185.27%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-46px_-20px] mask-size-[353px_200px] ml-[46px] mt-5 h-40 w-[255px] bg-[54.63%_47.35%] bg-no-repeat [grid-area:1_/_1]"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">{`MacBook Air 13.3" (2015, i5, 4GB RAM, 128GB SSD) – Classic Mac, Ultra Portable`}</p>
      </div>
      <div className="relative w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">₦378,000.00</p>
      </div>
      <div className="relative w-full shrink-0 font-['Inter:Medium',_sans-serif] text-[14px] font-medium">
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
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px] absolute inset-[5.208%]"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div
      className="relative size-[18px] shrink-0 overflow-clip"
      data-name="Frame"
    >
      <ClipPathGroup />
    </div>
  );
}

function CheckBox() {
  return (
    <div
      className="relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-start gap-[5px] p-0"
      data-name="Check Box"
    >
      <Frame />
      <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative w-full shrink-0 rounded-[10px] bg-indigo-800"
      data-name="Button"
    >
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-[#ffffff]">
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
      className="relative w-full shrink-0 rounded-[10px] bg-[#ffffff]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-gray-400"
      />
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-gray-400">
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-2.5 p-0"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[15px] p-0"
      data-name="Text"
    >
      <Text />
      <div className="relative w-full shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-5 rounded-[20px] bg-[#ffffff] p-[20px]"
      data-name="Card - 1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Image />
      <Text1 />
    </div>
  );
}

function Image1() {
  return (
    <div
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div
        className="relative ml-0 mt-0 h-[200px] w-[353px] rounded-[20px] bg-neutral-50 [grid-area:1_/_1]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div
        className="bg-size-[101.62%_159.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-85px_-20px] mask-size-[353px_200px] ml-[85px] mt-5 h-40 w-[184px] bg-[100%_49.4%] bg-no-repeat [grid-area:1_/_1]"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">
          HP EliteBook x360 1040 G8 – Power Meets Elegance
        </p>
      </div>
      <div className="relative w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">₦1,015,875.00</p>
      </div>
      <div className="relative w-full shrink-0 font-['Inter:Medium',_sans-serif] text-[14px] font-medium">
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
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px] absolute inset-[5.208%]"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="relative size-[18px] shrink-0 overflow-clip"
      data-name="Frame"
    >
      <ClipPathGroup1 />
    </div>
  );
}

function CheckBox1() {
  return (
    <div
      className="relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-start gap-[5px] p-0"
      data-name="Check Box"
    >
      <Frame1 />
      <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative w-full shrink-0 rounded-[10px] bg-indigo-800"
      data-name="Button"
    >
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-[#ffffff]">
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
      className="relative w-full shrink-0 rounded-[10px] bg-[#ffffff]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-gray-400"
      />
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-gray-400">
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-2.5 p-0"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[15px] p-0"
      data-name="Text"
    >
      <Text2 />
      <div className="relative w-full shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-5 rounded-[20px] bg-[#ffffff] p-[20px]"
      data-name="Card - 2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Image1 />
      <Text3 />
    </div>
  );
}

function Image2() {
  return (
    <div
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div
        className="relative ml-0 mt-0 h-[200px] w-[353px] rounded-[20px] bg-neutral-50 [grid-area:1_/_1]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div
        className="bg-size-[146.55%_112.68%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-133px_-20px] mask-size-[353px_200px] ml-[133px] mt-5 h-40 w-[88px] bg-center bg-no-repeat [grid-area:1_/_1]"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">
          iPhone 15 Pro Max – Titanium Power. Ultimate Performance. Pro Beyond.
        </p>
      </div>
      <div className="relative w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">₦1,299,000.00</p>
      </div>
      <div className="relative w-full shrink-0 font-['Inter:Medium',_sans-serif] text-[14px] font-medium">
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
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px] absolute inset-[5.208%]"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Frame3() {
  return (
    <div
      className="relative size-[18px] shrink-0 overflow-clip"
      data-name="Frame"
    >
      <ClipPathGroup2 />
    </div>
  );
}

function CheckBox2() {
  return (
    <div
      className="relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-start gap-[5px] p-0"
      data-name="Check Box"
    >
      <Frame3 />
      <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative w-full shrink-0 rounded-[10px] bg-indigo-800"
      data-name="Button"
    >
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-[#ffffff]">
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
      className="relative w-full shrink-0 rounded-[10px] bg-[#ffffff]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-gray-400"
      />
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-gray-400">
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-2.5 p-0"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[15px] p-0"
      data-name="Text"
    >
      <Text4 />
      <div className="relative w-full shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-5 rounded-[20px] bg-[#ffffff] p-[20px]"
      data-name="Card - 3"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Image2 />
      <Text5 />
    </div>
  );
}

function Image3() {
  return (
    <div
      className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
      data-name="Image"
    >
      <div
        className="relative ml-0 mt-0 h-[200px] w-[353px] rounded-[20px] bg-neutral-50 [grid-area:1_/_1]"
        data-name="Bg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
        />
      </div>
      <div
        className="bg-size-[170.32%_112.68%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-97px_-20px] mask-size-[353px_200px] ml-[97px] mt-5 h-40 w-[159px] bg-[43.44%_50%] bg-no-repeat mix-blend-darken [grid-area:1_/_1]"
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-[5px] p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-[355px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold">
        <p className="block leading-[26px]">
          Samsung Galaxy S24 Ultra – Epic Performance. Ultra Clarity. Built to
          Lead.
        </p>
      </div>
      <div
        className="relative min-w-full shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[16px] font-semibold"
        style={{ width: 'min-content' }}
      >
        <p className="block leading-[26px]">₦1,179,500.00</p>
      </div>
      <div
        className="relative min-w-full shrink-0 font-['Inter:Medium',_sans-serif] text-[14px] font-medium"
        style={{ width: 'min-content' }}
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
      className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.938px] mask-size-[18px_18px] absolute inset-[5.208%]"
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
    <div className="absolute inset-0 contents" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Frame4() {
  return (
    <div
      className="relative size-[18px] shrink-0 overflow-clip"
      data-name="Frame"
    >
      <ClipPathGroup3 />
    </div>
  );
}

function CheckBox3() {
  return (
    <div
      className="relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-start gap-[5px] p-0"
      data-name="Check Box"
    >
      <Frame4 />
      <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800">
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
      className="relative w-full shrink-0 rounded-[10px] bg-indigo-800"
      data-name="Button"
    >
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-[#ffffff]">
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
      className="relative w-full shrink-0 rounded-[10px] bg-[#ffffff]"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] border border-solid border-gray-400"
      />
      <div className="relative flex size-full flex-row items-center justify-center">
        <div className="relative box-border flex w-full flex-row content-stretch items-center justify-center gap-2.5 px-5 py-2.5">
          <div className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['Inter:Medium',_sans-serif] text-[16px] font-medium not-italic leading-[0] text-gray-400">
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-2.5 p-0"
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
      className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[15px] p-0"
      data-name="Text"
    >
      <Text6 />
      <div
        className="relative min-w-full shrink-0 text-left font-['Inter:Regular',_sans-serif] text-[14px] font-normal not-italic leading-[0] text-slate-800"
        style={{ width: 'min-content' }}
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
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-5 rounded-[20px] bg-[#ffffff] p-[20px]"
      data-name="Card - 4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Image3 />
      <Text7 />
    </div>
  );
}

function Cards() {
  return (
    <div
      className="absolute left-64 top-[458px] box-border flex flex-row content-stretch items-center justify-start gap-5 p-0"
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
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative shrink-0 text-nowrap font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block whitespace-pre leading-[26px]">Bank:</p>
      </div>
      <div className="relative w-[560px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold">
        <p className="block leading-[26px]">Wema Bank</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative shrink-0 text-nowrap font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block whitespace-pre leading-[26px]">Account Name:</p>
      </div>
      <div className="relative w-[508px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold">
        <p className="block leading-[26px]">SUREIMPORTERS/TOCHUKWU TOCHUKWU</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
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
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-2.5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative shrink-0 text-nowrap font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block whitespace-pre leading-[26px]">Account Number:</p>
      </div>
      <div className="relative w-[469px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold">
        <p className="block leading-[26px]">9322812663</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div
      className="relative box-border flex h-7 shrink-0 flex-row content-stretch items-center justify-start gap-2.5 p-0 text-left text-[16px] not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative shrink-0 text-nowrap font-['Inter:Regular',_sans-serif] font-normal">
        <p className="block whitespace-pre leading-[26px]">Currency:</p>
      </div>
      <div className="relative w-[550px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold">
        <p className="block leading-[26px]">NGN</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0"
      data-name="Text"
    >
      <Text11 />
      <Text12 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-start gap-5 rounded-[20px] bg-[#ffffff] p-[30px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Text10 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-col content-stretch items-start justify-center gap-2.5 p-0 text-left not-italic leading-[0] text-slate-800"
      data-name="Text"
    >
      <div className="relative w-[154px] shrink-0 font-['Inter:Regular',_sans-serif] text-[16px] font-normal">
        <p className="block leading-[26px]">Wallet Balance:</p>
      </div>
      <div className="relative w-[154px] shrink-0 font-['Inter:Semi_Bold',_sans-serif] text-[28px] font-semibold">
        <p className="block leading-[38px]">₦5,250.00</p>
      </div>
    </div>
  );
}

function VuesaxOutlineWallet2() {
  return (
    <div
      className="absolute inset-0 contents"
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
      className="relative size-6 shrink-0"
      data-name="vuesax/outline/wallet-2"
    >
      <VuesaxOutlineWallet2 />
    </div>
  );
}

function Icon() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-center gap-2.5 rounded-3xl bg-[rgba(173,110,237,0.1)] p-[10px]"
      data-name="Icon"
    >
      <VuesaxOutlineWallet3 />
    </div>
  );
}

function Text15() {
  return (
    <div
      className="relative box-border flex shrink-0 flex-row content-stretch items-start justify-start gap-2.5 rounded-[20px] bg-[#ffffff] p-[30px]"
      data-name="Text"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-solid border-[rgba(0,0,0,0.05)]"
      />
      <Text14 />
      <Icon />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-start gap-[30px] p-0">
      <Frame2 />
      <Text15 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute left-64 top-[178px] box-border flex flex-col content-stretch items-start justify-start gap-2.5 p-0">
      <div className="relative w-full shrink-0 text-left font-['Inter:Semi_Bold',_sans-serif] text-[18px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block leading-[28px]">Virtual Account Details</p>
      </div>
      <Frame5 />
    </div>
  );
}

export default function PaySmallSmall() {
  return (
    <div className="relative size-full bg-slate-50" data-name="Pay Small Small">
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
      <div className="absolute left-0 top-[937px] h-2.5 w-[235px] bg-[#161629]" />
      <div className="absolute left-64 top-[110px] text-nowrap text-left font-['Inter:Semi_Bold',_sans-serif] text-[28px] font-semibold not-italic leading-[0] text-slate-800">
        <p className="block whitespace-pre leading-[38px]">Pay Small Small</p>
      </div>
      <Title />
      <Cards />
      <Frame6 />
    </div>
  );
}
