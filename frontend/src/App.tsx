import { useState } from 'react';
import { getCurrentUserApi, updateCurrentUserNameApi } from './api/UserApi';
import type { UserDTO } from './DTOs/userDTO';
import { User } from './models/User';

function App() {
  const [user, setUser] = useState<User>();
  const [inputName, setInputName] = useState<string>("");

  async function displayCurrentUser() {
    const userData = await getCurrentUserApi();

    setUser(userData);
  }

  async function updateName() {
    const dto: UserDTO = { name: inputName };
    const newUser = await updateCurrentUserNameApi(dto);

    setUser(newUser);
  }

  return (
    <>
    <button onClick={ displayCurrentUser }>TEST ME</button>
    <div>{ user?.name }</div>

    <button onClick={ updateName }>Update Name</button>
    <input onChange={(e) => setInputName(e.target.value)}></input>
    </>
  )
}

export default App
