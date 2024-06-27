import { subscribeFollow } from "./subscribe"

const socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws")

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Connection established");
  console.log({event});
})

// Listen for messages
socket.addEventListener("message", async (event) => {
  console.log(event.data)
  const data = JSON.parse(event.data);
  if (data?.metadata?.message_type === 'session_welcome') {
    const sessionId = data.payload.session.id;
    await subscribeFollow(sessionId);
  }
})
