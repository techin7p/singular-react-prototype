import { useSubscriptions } from "./hooks/useSubscriptions"


const WebSocketComponent = () => {
  const { readyState, lastJsonMessage } = useSubscriptions();

  return (
    <div>
      <h1>EventSub</h1>
      <p>Ready state: {readyState}</p>
      <p>Last message: {JSON.stringify(lastJsonMessage)}</p>
    </div>
  )
}

export default WebSocketComponent
