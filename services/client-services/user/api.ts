import { UserUpdateData } from "@/types/user";
import { getHeaders } from "@/utils/header";
import { USER_ERRORS, API_ERRORS } from "@/utils/error-constants";

export class usersService {
  static async getUserById(id: number, jwt: string) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return { error: USER_ERRORS.NOT_FOUND };
    }
  }

  static async updateUser(data: UserUpdateData, id: number, jwt: string) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return { error: USER_ERRORS.UPDATE_FAILED };
    }
  }

  static async deleteUser(id: number, jwt: string) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return { error: USER_ERRORS.DELETE_FAILED };
    }
  }

  static async getAllUsers() {
    try {
      const response = await fetch(`/api/users`, {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return { error: API_ERRORS.REQUEST_FAILED };
    }
  }
}
