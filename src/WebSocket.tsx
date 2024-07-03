import {getAuthUrl} from "./helpers/auth"
import {useSubscriptions} from "./hooks/useSubscriptions"

const WebSocketComponent = () => {
  const {user, readyState, lastJsonMessage} = useSubscriptions()

  return (
    <div>
      <h1>EventSub</h1>
      {user ? (
        <div>Connected</div>
      ) : (
        <a href={getAuthUrl()}>Connect with Twitch</a>
      )}
      <p>Ready state: {readyState}</p>
      <p>Last message: {JSON.stringify(lastJsonMessage)}</p>
    </div>
  )
}

export default WebSocketComponent
