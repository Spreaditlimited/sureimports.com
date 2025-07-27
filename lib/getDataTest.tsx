export default async function getDataTest() {
  //const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const res = await fetch(
    'https://65b71eb846324d531d53ef11.mockapi.io/api/v1/users',
  );

  return res.json();
}
