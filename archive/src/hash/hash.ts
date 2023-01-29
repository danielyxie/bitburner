export function hash(): string {
  try {
    if (__COMMIT_HASH__) {
      return __COMMIT_HASH__;
    }
  } catch (err) {}
  return "DEV";
}
