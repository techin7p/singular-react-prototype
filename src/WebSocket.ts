import {useEffect, useRef} from "react"
import {subscribeFollow} from "./helpers/eventsub/subscribe"

const WebSocketComponent = () => {
  const connection = useRef<any>(null)

  useEffect(() => {
    const socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=60")

    // Connection opened
    socket.addEventListener("open", () => {
      socket.send("Connection established")
    })

    // Listen for messages
    socket.addEventListener("message", async (event) => {
      console.log("Message from server ", event.data)
      const data = JSON.parse(event.data)
      if (data?.metadata?.message_type === "session_welcome") {
        const sessionId = data.payload.session.id
        await subscribeFollow(sessionId)
      }
    })

    connection.current = socket

    return () => connection.current?.close()
  }, [])

  return null
}

export default WebSocketComponent
