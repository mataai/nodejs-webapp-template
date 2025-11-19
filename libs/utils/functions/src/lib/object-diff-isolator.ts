export function getDifferingProperties<T extends object>(
  old: Partial<T>,
  updated: Partial<T>,
): {
  oldDiff: Partial<T>;
  updatedDiff: Partial<T>;
} {
  const oldDiff: Partial<T> = {};
  const updatedDiff: Partial<T> = {};

  const allKeys = new Set<keyof T>([
    ...(Object.keys(old) as (keyof T)[]),
    ...(Object.keys(updated) as (keyof T)[]),
  ]);

  allKeys.forEach((key: keyof T) => {
    if (old[key as keyof T] !== updated[key]) {
      if (key in old) oldDiff[key] = old[key as keyof T];
      if (key in updated) updatedDiff[key] = updated[key];
    }
  });

  return { oldDiff, updatedDiff };
}
