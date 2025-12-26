import Image from 'next/image';
//import Paysmallsmall from "./components/Paysmallsmall";
import Wallet from './components/Wallet';

export default function Home() {
  return (
    <>
      <div className="dark:bg-black">
        <div className="p-4 dark:bg-black">
          <div className="flex justify-between max-sm:flex-col">
            <div className="text-[28px] font-bold text-black dark:text-slate-200 max-sm:pb-4">
              My Wallet
            </div>
          </div>

          <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
            Manage your wallet balance, view transactions, and withdraw funds.
          </div>
        </div>
        <Wallet />
      </div>
    </>
  );
}
