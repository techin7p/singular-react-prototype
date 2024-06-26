
export const getAuthUrl = () => {
  console.log(import.meta.env);
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const scopes = ["user:read:email"];

  return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join("+")}`;
};