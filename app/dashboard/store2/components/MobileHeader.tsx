import mobilesvgPaths from "../imports/svg-oml3ehjwbt";
import imgSureimportsReverse from '../../../../public/favicon.png';
import { SafeThemeToggle } from "./ThemeToggle";

export function MobileHeader() {
  return (
    <>
      {/* Dark Header */}
      <div className="bg-[#0e0e1f] dark:bg-card w-full pt-12 pb-4">
        <div className="relative h-[42px] flex items-center">
          {/* Logo */}
          <div 
            className="absolute left-4 w-[180px] h-[20px] bg-no-repeat bg-contain"
            style={{ backgroundImage: `url('${imgSureimportsReverse}')` }}
          />
          
          {/* Theme Toggle */}
          <div className="absolute left-56">
            <SafeThemeToggle />
          </div>
          
          {/* Hamburger Menu */}
          <div className="absolute right-16 w-[26px] h-[20px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 20">
              <path d={mobilesvgPaths.p26572800} fill="white" className="dark:fill-foreground" />
            </svg>
          </div>
          
          {/* Search Icon */}
          <div className="absolute right-4 w-[26px] h-[26px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
              <path d={mobilesvgPaths.p14b4c900} fill="white" className="dark:fill-foreground" />
              <path d={mobilesvgPaths.p32503f00} fill="white" className="dark:fill-foreground" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}