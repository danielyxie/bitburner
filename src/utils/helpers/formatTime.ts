import { format } from "date-fns";

export function formatTime(fmt: string): string {
  try {
    return format(new Date(), fmt);
  } catch (err: any) {
    return "format error";
  }
}
