import { useState } from 'react';
import { getCurrentUserApi } from './api/UserApi';

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState<string>("Yeah");

  async function displayCurrentUser() {
    const user = await getCurrentUserApi();

    setText(user.name);
  } 

  return (
    <>
    <button onClick={displayCurrentUser}>TEST ME</button>
    <div>{text}</div>
    </>
  )
}

export default App
