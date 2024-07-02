
export const subscribeFollow = async (sessionId: string) => {
  const response = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
    method: "POST",
    headers: {
      "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "type": "channel.follow",
      "version": "2",
      "condition": {
        "broadcaster_user_id": "731867899",
        "moderator_user_id": "731867899",
      },
      "transport": {
        "method": "websocket",
        "session_id": sessionId,
      },
    })
  })
  const data = await response.json();
  console.log(data);
}

export const removeSubscription = async (id: string) => {
  await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
    method: "DELETE",
    headers: {
      "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  })
}

type SubscribeParams = {
  type: string;
  version: string;
  condition: object;
  sessionId: string;
}
export const subscribe = async ({ type, version, condition, sessionId}: SubscribeParams) => {
  const response = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
    method: "POST",
    headers: {
      "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "type": type,
      "version": version,
      "condition": condition,
      "transport": {
        "method": "websocket",
        "session_id": sessionId,
      },
    })
  })
  const data = await response.json();
  console.log(data);

  return data;
}