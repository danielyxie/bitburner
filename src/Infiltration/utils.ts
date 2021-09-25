export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getArrow(event: KeyboardEvent): string {
  switch (event.keyCode) {
    case 38:
    case 87:
      return "↑";
    case 65:
    case 37:
      return "←";
    case 40:
    case 83:
      return "↓";
    case 39:
    case 68:
      return "→";
  }
  return "";
}
