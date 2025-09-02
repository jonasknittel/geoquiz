import type { UserDTO } from "../DTOs/userDTO";
import { mapToUser } from "../mappers/userMapper";
import type { User } from "../models/User";
import { api } from "./api";

export const getCurrentUserApi = async (): Promise<User> => {
    const res = await api.get<UserDTO>("/users/me");

    console.log('getCurrentUserApi');

    const user = mapToUser(res.data);
    
    return mapToUser(res.data);

}