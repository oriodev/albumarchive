import dayjs from "dayjs";

export const formatLocaltime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const localDate = date.toLocaleString();
  return dayjs(localDate).format("HH:MM");
};

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const localDate = date.toLocaleString();
  return dayjs(localDate).format("DD-MM-YY, HH:MM");
};
