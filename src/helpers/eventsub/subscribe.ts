
export const subscribeFollow = async (sessionId: string) => {
  const response = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
    method: "POST",
    headers: {
      "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "type": "channel.chat.message",
      "version": "1",
      "condition": {
        "broadcaster_user_id": "731867899",
        "user_id": "731867899",
      },
      "transport": {
        "method": "websocket",
        "session_id": sessionId
      },
    })
  })
  const data = await response.json();
  console.log(data);
}