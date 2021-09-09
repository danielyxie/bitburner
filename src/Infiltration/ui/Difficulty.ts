interface DifficultySetting {
  [key: string]: number;
}

interface DifficultySettings {
  Trivial: DifficultySetting;
  Normal: DifficultySetting;
  Hard: DifficultySetting;
  Impossible: DifficultySetting;
}

// I could use `any` to simply some of this but I also want to take advantage
// of the type safety that typescript provides. I'm just not sure how in this
// case.
export function interpolate(settings: DifficultySettings, n: number, out: DifficultySetting): DifficultySetting {
  // interpolates between 2 difficulties.
  function lerpD(a: DifficultySetting, b: DifficultySetting, t: number): DifficultySetting {
    // interpolates between 2 numbers.
    function lerp(x: number, y: number, t: number): number {
      return (1 - t) * x + t * y;
    }
    for (const key of Object.keys(a)) {
      out[key] = lerp(a[key], b[key], t);
    }
    return a;
  }
  if (n < 0) return lerpD(settings.Trivial, settings.Trivial, 0);
  if (n >= 0 && n < 1) return lerpD(settings.Trivial, settings.Normal, n);
  if (n >= 1 && n < 2) return lerpD(settings.Normal, settings.Hard, n - 1);
  if (n >= 2 && n < 3) return lerpD(settings.Hard, settings.Impossible, n - 2);
  return lerpD(settings.Impossible, settings.Impossible, 0);
}
