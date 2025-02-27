interface User{
    id?: number,
    fname?: string,
    email?: string,
    password?: string,
}

export class authService {
  static async login(data: User) {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if(response.status==401){
        return response
      }
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async signup(data: User) {
    try {
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }
}
