import {useEffect, useRef, useState} from "react"
import {
  removeSubscription,
  subscribe,
  subscribeFollow,
} from "./helpers/eventsub/subscribe"

const subscriptions = [
  {
    type: "channel.follow",
    version: "2",
    condition: {
      broadcaster_user_id: "731867899",
      moderator_user_id: "731867899",
    },
  },
  // {
  //   type: "channel.subscribe",
  //   version: "1",
  //   condition: {
  //     broadcaster_user_id: "731867899",
  //   },
  // },
  // {
  //   type: "channel.chat.message",
  //   version: "1",
  //   condition: {
  //     broadcaster_user_id: "731867899",
  //     user_id: "731867899",
  //   },
  // },
]

const WebSocketComponent = () => {
  const [connectAttempt, setConnectAttempt] = useState(0)
  const [attemptReconnect, setAttemptReconnect] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [keepAliveFor, setKeepAliveFor] = useState<number>(0)
  const [subIds, setSubIds] = useState<string[]>([])
  const connection = useRef<WebSocket | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
        const keepAliveFor = data.payload.session.keepalive_timeout_seconds
        setSessionId(sessionId)
        setKeepAliveFor(keepAliveFor)
        setConnectAttempt(1)
        // await subscribeAll(sessionId)
        console.log(keepAliveFor)
        updateTimeout(keepAliveFor)
      }
    })

    socket.addEventListener("close", () => {
      console.log('close!!')
      if (attemptReconnect) {
        setConnectAttempt((prev) => prev + 1)
        reconnect()
      }
    })

    connection.current = socket
  }

  const reconnect = () => {
    if (connection.current?.readyState === 1) {
      close()
    }

    // kill app after max attempts, about 2.5 hours of trying
    if (connectAttempt > 12) {
      return
    }

    const delay = Math.pow(2, connectAttempt)

    console.warn("Reconnecting, attempt", connectAttempt, delay)
    setTimeout(init, delay * 1000)
  }

  const updateTimeout = (_keepAliveFor?: number) => {
    const k = _keepAliveFor || keepAliveFor
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(function () {
      console.warn("Keep-Alive Timeout! Trying to reconnect …")
      close()

      if (attemptReconnect) {
        reconnect()
      }
    }, (k + 5) * 1000) // add 5 seconds grace period
  }

  const subscribeAll = async (sessionId: string) => {
    const subIds = []
    for (const sub of subscriptions) {
      const data = await subscribe({...sub, sessionId})
      console.log(data)
      subIds.push(data.data[0].id)
    }
    console.log(subIds)
    setSubIds(subIds)
  }

  const unsubscribeAll = async () => {
    for (const id of subIds) {
      await removeSubscription(id)
    }
  }

  const close = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    unsubscribeAll()

    // close websocket connection
    if (connection.current) {
      connection.current.close()

      connection.current = null
    }

    console.info("Connection closed.")
  }

  useEffect(() => {
    console.log("init")
    init()

    return () => {
      console.log('cleanup')
      setAttemptReconnect(false)
      close()
    }
  }, [])

  return <div />
}

export default WebSocketComponent
