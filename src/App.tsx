import "./App.css"
import { getAuthUrl } from "./helpers/auth"

function App() {

  return (
    <>
      <div>
        <a href={getAuthUrl()}>
          Connect with Twitch
        </a>
      </div>
    </>
  )
}

export default App
