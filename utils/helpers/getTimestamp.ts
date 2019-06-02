/**
 * Returns a MM/DD HH:MM timestamp for the current time
 */
export function getTimestamp() {
        const d: Date = new Date();
        // A negative slice value takes from the end of the string rather than the beginning.
        const stringWidth: number = -2;
        const formattedHours: string = `0${d.getHours()}`.slice(stringWidth);
        const formattedMinutes: string = `0${d.getMinutes()}`.slice(stringWidth);

        return `${d.getMonth() + 1}/${d.getDate()} ${formattedHours}:${formattedMinutes}`;
}
