import type { UserDTO } from "../DTOs/userDTO";
import type { User } from "../models/User";

export const mapToUser = (dto: UserDTO): User => ({
  id: dto.id,
  name: dto.name
});