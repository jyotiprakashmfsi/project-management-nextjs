export class NotificationApi {
    static async approachingTasks(id: number, jwt: string) {
        try {
            const response = await fetch(`/api/notifications/approaching/${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorisation: `Bearer ${jwt}`,
              },
            });
      
            const result = await response.json();
            console.log("API approaching Tasks fetched:", result.data)
            return result.data;
          } catch (error) {
              console.log(error)
              return error;
          }
    }

    static async overdueTasks(id: number, jwt: string) {
        try {
            const response = await fetch(`/api/notifications/overdue/${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorisation: `Bearer ${jwt}`,
              },
            });
      
            const result = await response.json();
            console.log("API overdue Tasks fetched:", result.data)
            return result.data;
          } catch (error) {
              console.log(error)
              return error;
          }
    }
}