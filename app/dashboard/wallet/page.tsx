import Image from 'next/image';
//import Paysmallsmall from "./components/Paysmallsmall";
import Wallet from './components/Wallet';

export default function Home() {
  return (
    <>
      <div className="dark:bg-black">
        <Wallet />
      </div>
    </>
  );
}
