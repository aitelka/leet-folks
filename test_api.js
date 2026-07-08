async function main() {
  const uid = process.env.FORTYTWO_CLIENT_ID;
  const secret = process.env.FORTYTWO_CLIENT_SECRET;

  const tokenRes = await fetch("https://api.intra.42.fr/oauth/token", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${uid}&client_secret=${secret}`
  });
  const token = (await tokenRes.json()).access_token;
  
  const usersRes = await fetch("https://api.intra.42.fr/v2/users?page[size]=1&include=cursus_users", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const users = await usersRes.json();
  console.log(users[0].cursus_users);
}
main();
