/**
 * Lore / world building literature files that can be found on servers.
 * These files can be read by the player
 */
export class Literature {
    title: string;
    fn: string;
    txt: string;

    constructor(title: string, filename: string, txt: string) {
        this.title = title;
        this.fn = filename;
        this.txt = txt;
    }
}