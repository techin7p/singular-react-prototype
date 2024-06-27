
export const getAuthUrl = () => {
  console.log(import.meta.env);
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const scopes = ["user:read:email", "moderator:read:followers", "user:read:chat", "user:bot", "channel:bot"];

  return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join("+")}`;
};

export const getUsers = async () => {
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
      "Authorization": `Bearer odj3i4efwbisbgcrt2xac2vf1j4d6d`,
    },
  });

  const data = await response.json();
  console.log(data);
  return data;
}