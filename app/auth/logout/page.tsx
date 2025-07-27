import { redirect } from 'next/navigation';
//import Logout from './components/Logout';

export default function Page() {
  redirect('/');

  return (
    <div>
      {/* <h1>Logout Page</h1> */}
      {/* <Logout /> */}
    </div>
  );
}
