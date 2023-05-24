import dayjs from "dayjs";

export const toYMD = (time: string) =>
  dayjs(time).format("YYYY/MM/DD HH:mm:ss");

export const toYMD_Short = (time: string) => dayjs(time).format("YYYY/MM/DD");
