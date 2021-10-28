export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getArrow(event: KeyboardEvent): string {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      return "↑";
    case "ArrowLeft":
    case "a":
      return "←";
    case "ArrowDown":
    case "s":
      return "↓";
    case "ArrowRight":
    case "d":
      return "→";
  }
  return "";
}
