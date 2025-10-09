import { useEffect, useState } from "react";
import { getCurrentUserApi, updateCurrentUserNameApi } from "../api/UserApi";
import type { UserDTO } from "../DTOs/userDTO";
import type { User } from "../models/User";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';

export const ApiTest = () => {
    const [user, setUser] = useState<User>();
    const [inputName, setInputName] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
        const userData = await getCurrentUserApi();
            setUser(userData);
        };
        fetchUser();
    }, [])

    async function updateName() {
        const dto: UserDTO = { name: inputName };
        const newUser = await updateCurrentUserNameApi(dto);

        setUser(newUser);
    }

    return (
        <Card style={{ margin: '20px' }} title="Api Tests">
            <div>User.id: { user?.id }</div>
            <div>User.name: { user?.name }</div>

            <Button onClick={ updateName }>Update Name</Button>
            <input onChange={(e) => setInputName(e.target.value)}></input>
        </Card>
    )
}