import { getElementById } from "../../utils/uiHelpers/getElementById";

/**
 * Adds some output to the terminal.
 * @param input Text or HTML to output to the terminal
 */
export function post(input: string) {
    postContent(input);
}

/**
 * Adds some output to the terminal with an identifier of "hack-progress-bar"
 * @param input Text or HTML to output to the terminal
 */
export function hackProgressBarPost(input: string) {
    postContent(input, "hack-progress-bar");
}

/**
 * Adds some output to the terminal with an identifier of "hack-progress"
 * @param input Text or HTML to output to the terminal
 */
export function hackProgressPost(input: string) {
    postContent(input, "hack-progress");
}

function postContent(input: string, id?: string) {
    // tslint:disable-next-line:max-line-length
    const style: string = `color: var(--my-font-color); background-color:var(--my-background-color);${id === undefined ? " white-space:pre-wrap;" : ""}`;
    // tslint:disable-next-line:max-line-length
    const content: string = `<tr class="posted"><td ${id === undefined ? 'class="terminal-line"' : `id="${id}"`} style="${style}">${input}</td></tr>`;
    const inputElement: HTMLElement = getElementById("terminal-input");
    inputElement.insertAdjacentHTML("beforebegin", content);
    scrollTerminalToBottom();
}

function scrollTerminalToBottom() {
    const container: HTMLElement = getElementById("terminal-container");
    container.scrollTop = container.scrollHeight;
}
