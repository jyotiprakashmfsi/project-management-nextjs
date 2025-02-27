export const getLocalTimeString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 19).replace('T', ' ');
  };

export const isOverdue = (endTime: string) => {
    const endDate = new Date(endTime);
    const now = new Date();
    return endDate < now;
};

export const isDueSoon = (endTime: string) => {
    const endDate = new Date(endTime);
    const now = new Date(Date.now() + 5 * 60000);
    return endDate < now;
};