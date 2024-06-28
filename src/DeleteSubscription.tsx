import {useState} from "react"
import { removeSubscription } from "./helpers/eventsub/subscribe"

const DeleteSubscription = () => {
  const [id, setId] = useState("")

  return (
    <div>
      <input value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={() => removeSubscription(id)}></button>
    </div>
  )
}

export default DeleteSubscription;