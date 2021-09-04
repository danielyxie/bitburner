import { renderToStaticMarkup } from "react-dom/server";
import { getElementById } from "../../utils/uiHelpers/getElementById";

/**
 * Adds some output to the terminal.
 * @param input Text or HTML to output to the terminal
 */
export function post(input: string): void {
  postContent(input);
}

export function postError(input: string): void {
  postContent(`ERROR: ${input}`, { color: "#ff2929" });
}

/**
 * Adds some output to the terminal with an identifier of "hack-progress-bar"
 * @param input Text or HTML to output to the terminal
 */
export function hackProgressBarPost(input: string): void {
  postContent(input, { id: "hack-progress-bar" });
}

/**
 * Adds some output to the terminal with an identifier of "hack-progress"
 * @param input Text or HTML to output to the terminal
 */
export function hackProgressPost(input: string): void {
  postContent(input, { id: "hack-progress" });
}

interface IPostContentConfig {
  id?: string; // Replaces class, if specified
  color?: string; // Additional class for terminal-line. Does NOT replace
}

export function postElement(element: JSX.Element): void {
  postContent(renderToStaticMarkup(element));
}

export function postContent(
  input: string,
  config: IPostContentConfig = {},
): void {
  // tslint:disable-next-line:max-line-length
  const style = `color: ${
    config.color != null ? config.color : "var(--my-font-color)"
  }; background-color:var(--my-background-color);${
    config.id === undefined ? " white-space:pre-wrap;" : ""
  }`;
  // tslint:disable-next-line:max-line-length
  const content = `<tr class="posted"><td ${
    config.id === undefined ? `class="terminal-line"` : `id="${config.id}"`
  } style="${style}">${input}</td></tr>`;
  const inputElement: HTMLElement = getElementById("terminal-input");
  inputElement.insertAdjacentHTML("beforebegin", content);
  scrollTerminalToBottom();
}

function scrollTerminalToBottom(): void {
  const container: HTMLElement = getElementById("terminal-container");
  container.scrollTop = container.scrollHeight;
}
