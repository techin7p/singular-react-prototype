import {useEffect, useRef, useState} from "react"
import {subscribeFollow} from "./helpers/eventsub/subscribe"

const WebSocketComponent = () => {
  const [connectAttempt, setConnectAttempt] = useState(0)
  const connection = useRef<WebSocket | null>(null)

  const init = () => {
    const socket = new WebSocket(
      "wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=60"
    )
    

    // Connection opened
    socket.addEventListener("open", () => {})

    // Listen for messages
    socket.addEventListener("message", async (event) => {
      console.log("Message from server ", event.data)
      const data = JSON.parse(event.data)
      if (data?.metadata?.message_type === "session_welcome") {
        const sessionId = data.payload.session.id
        const connectedAt = data.payload.session.connected_at
        await subscribeFollow(sessionId, connectedAt);
      }
    })

    connection.current = socket
  }

  const reconnect = () => {

    if (connection.current?.readyState === 1) {
      close();
    }

    // kill app after max attempts, about 2.5 hours of trying
    if (connectAttempt > 12) {
      document.documentElement.classList.add('error');
      return;
    }

    const delay = Math.pow(2, connectAttempt);

    console.warn('Reconnecting, attempt', connectAttempt, delay);
    setTimeout(init, delay*1000);
  }

  useEffect(() => {
    init();

    return () => connection.current?.close()
  }, [])

  return null
}

export default WebSocketComponent
