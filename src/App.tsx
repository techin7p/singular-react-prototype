import {useEffect} from "react"
import "./App.css"
import WebSocket from "./WebSocket"
import {getAuthUrl, getUsers} from "./helpers/auth"
import DeleteSubscription from "./DeleteSubscription"

function App() {
  const currentUrl = window.location.href

  // Parse the URL to work with it easily
  const urlParams = new URLSearchParams(currentUrl.split("#")[1])

  // Extract the access_token value
  const accessToken = urlParams.get("access_token")

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken)
      console.log("Access token stored in localStorage:", accessToken)
    } else {
      console.error("Access token not found in the URL.")
    }
  }, [accessToken])

  return (
    <>
      <div>
        <a href={getAuthUrl()}>Connect with Twitch</a>
        <button onClick={() => getUsers()}>Get Users</button>
      </div>
      <DeleteSubscription />
      <WebSocket />
    </>
  )
}

export default App
