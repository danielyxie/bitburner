// choose random character for generating plaintexts to compress
export function comprGenChar(): string {
  const r = Math.random();
  if (r < 0.4) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(26 * Math.random())];
  } else if (r < 0.8) {
    return "abcdefghijklmnopqrstuvwxyz"[Math.floor(26 * Math.random())];
  } else {
    return "01234567689"[Math.floor(10 * Math.random())];
  }
}

// generate plaintext which is amenable to LZ encoding
export function comprLZGenerate(): string {
  const length = 50 + Math.floor(25 * (Math.random() + Math.random()));
  let plain = "";

  while (plain.length < length) {
    if (Math.random() < 0.8) {
      plain += comprGenChar();
    } else {
      const length = 1 + Math.floor(9 * Math.random());
      const offset = 1 + Math.floor(9 * Math.random());
      if (offset > plain.length) {
        continue;
      }

      for (let i = 0; i < length; ++i) {
        plain += plain[plain.length - offset];
      }
    }
  }

  return plain.substring(0, length);
}

// compress plaintest string
export function comprLZEncode(plain: string): string {
  // for state[i][j]:
  //      if i is 0, we're adding a literal of length j
  //      else, we're adding a backreference of offset i and length j
  let cur_state: (string | null)[][] = Array.from(Array(10), () => Array(10).fill(null));
  let new_state: (string | null)[][] = Array.from(Array(10), () => Array(10));

  function set(state: (string | null)[][], i: number, j: number, str: string): void {
    const current = state[i][j];
    if (current == null || str.length < current.length) {
      state[i][j] = str;
    } else if (str.length === current.length && Math.random() < 0.5) {
      // if two strings are the same length, pick randomly so that
      // we generate more possible inputs to Compression II
      state[i][j] = str;
    }
  }

  // initial state is a literal of length 1
  cur_state[0][1] = "";

  for (let i = 1; i < plain.length; ++i) {
    for (const row of new_state) {
      row.fill(null);
    }
    const c = plain[i];

    // handle literals
    for (let length = 1; length <= 9; ++length) {
      const string = cur_state[0][length];
      if (string == null) {
        continue;
      }

      if (length < 9) {
        // extend current literal
        set(new_state, 0, length + 1, string);
      } else {
        // start new literal
        set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
      }

      for (let offset = 1; offset <= Math.min(9, i); ++offset) {
        if (plain[i - offset] === c) {
          // start new backreference
          set(new_state, offset, 1, string + length + plain.substring(i - length, i));
        }
      }
    }

    // handle backreferences
    for (let offset = 1; offset <= 9; ++offset) {
      for (let length = 1; length <= 9; ++length) {
        const string = cur_state[offset][length];
        if (string == null) {
          continue;
        }

        if (plain[i - offset] === c) {
          if (length < 9) {
            // extend current backreference
            set(new_state, offset, length + 1, string);
          } else {
            // start new backreference
            set(new_state, offset, 1, string + "9" + offset + "0");
          }
        }

        // start new literal
        set(new_state, 0, 1, string + length + offset);
      }
    }

    const tmp_state = new_state;
    new_state = cur_state;
    cur_state = tmp_state;
  }

  let result = null;

  for (let len = 1; len <= 9; ++len) {
    let string = cur_state[0][len];
    if (string == null) {
      continue;
    }

    string += len + plain.substring(plain.length - len, plain.length);
    if (result == null || string.length < result.length) {
      result = string;
    } else if (string.length == result.length && Math.random() < 0.5) {
      result = string;
    }
  }

  for (let offset = 1; offset <= 9; ++offset) {
    for (let len = 1; len <= 9; ++len) {
      let string = cur_state[offset][len];
      if (string == null) {
        continue;
      }

      string += len + "" + offset;
      if (result == null || string.length < result.length) {
        result = string;
      } else if (string.length == result.length && Math.random() < 0.5) {
        result = string;
      }
    }
  }

  return result ?? "";
}

// decompress LZ-compressed string, or return null if input is invalid
export function comprLZDecode(compr: string): string | null {
  let plain = "";

  for (let i = 0; i < compr.length; ) {
    const literal_length = compr.charCodeAt(i) - 0x30;

    if (literal_length < 0 || literal_length > 9 || i + 1 + literal_length > compr.length) {
      return null;
    }

    plain += compr.substring(i + 1, i + 1 + literal_length);
    i += 1 + literal_length;

    if (i >= compr.length) {
      break;
    }
    const backref_length = compr.charCodeAt(i) - 0x30;

    if (backref_length < 0 || backref_length > 9) {
      return null;
    } else if (backref_length === 0) {
      ++i;
    } else {
      if (i + 1 >= compr.length) {
        return null;
      }

      const backref_offset = compr.charCodeAt(i + 1) - 0x30;
      if ((backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) || backref_offset > plain.length) {
        return null;
      }

      for (let j = 0; j < backref_length; ++j) {
        plain += plain[plain.length - backref_offset];
      }

      i += 2;
    }
  }

  return plain;
}
