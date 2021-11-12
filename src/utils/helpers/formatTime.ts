import { format } from "date-fns";

export function formatTime(fmt: string): string {
  try {
    return format(new Date(), fmt);
  } catch (err: any) {
    console.error(err);
    return "format error";
  }
}
