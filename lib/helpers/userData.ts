import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function userData() {
  const cookieStore = await cookies();
  const isLoggedIn_auth = cookieStore.get('Authorization');
  const isLoggedIn_user = cookieStore.get('UserData');

  if (isLoggedIn_auth && isLoggedIn_user) {
    //USER DATA
    const userData = cookieStore.get('UserData');
    const datax: any = userData?.value;
    const getUser = JSON.parse(datax);
    return getUser;
  } else {
    //delete cookies
    cookieStore.delete('Authorization');
    cookieStore.delete('UserData');

    //redirect to login
    revalidatePath('../login');
    redirect('../login');

    //stop all preceeding instructions
    process.exit();
  }

  //console.log('GOD IS GOOD AND GREATE!:::'+getUser.userEmail);
}
