import { useEffect, useState } from "react"
import { removeSubscription, subscribe } from "../helpers/eventsub/subscribe"
import useWebSocket from "react-use-websocket"
import { getUsers } from "../helpers/auth"

export const useSubscriptions = () => {
  const [subIds, setSubIds] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  const subscriptions = [
    {
      type: "channel.follow",
      version: "2",
      condition: {
        broadcaster_user_id: user?.id,
        moderator_user_id: user?.id,
      },
    },
    // {
    //   type: "channel.subscribe",
    //   version: "1",
    //   condition: {
    //     broadcaster_user_id: "731867899",
    //   },
    // },
    {
      type: "channel.chat.message",
      version: "1",
      condition: {
        broadcaster_user_id: user?.id,
        user_id: user?.id,
      },
    },
  ]

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const data = await getUsers();
    setUser(data.data[0])
  }

  const { lastJsonMessage, readyState } = useWebSocket("wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=60", {
    onMessage: async (event) => {
      console.log("Message from server ", event.data)
      const data = JSON.parse(event.data)
      if (data?.metadata?.message_type === "session_welcome") {
        const sessionId = data.payload.session.id
        await subscribeAll(sessionId)
      }
    },
    onClose: () => {
      console.log('close!!')
      unsubscribeAll()
    },
    shouldReconnect: () => true
  }, !!user);

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

  return { user, lastJsonMessage, readyState };
}