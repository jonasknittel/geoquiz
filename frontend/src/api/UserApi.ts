import type { UserDTO } from "../DTOs/userDTO";
import { mapToUser } from "../mappers/userMapper";
import type { User } from "../models/User";
import { api } from "./api";

export const getCurrentUserApi = async (): Promise<User> => {
    const res = await api.get<UserDTO>("/users/me");
    
    return mapToUser(res.data);
}

export const updateCurrentUserNameApi = async (user: UserDTO): Promise<User> => {
    const res = await api.patch<UserDTO>("/users/me", {
        user
    });

    return mapToUser(res.data);
}