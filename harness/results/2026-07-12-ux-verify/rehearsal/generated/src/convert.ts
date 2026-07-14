import { findUnit } from "./units";

export class ConversionError extends Error {}

export function convert(value: number, from: string, to: string): number {
  const f = findUnit(from);
  const t = findUnit(to);
  if (!f) throw new ConversionError(`unknown unit: ${from}`);
  if (!t) throw new ConversionError(`unknown unit: ${to}`);
  if (f.dimension !== t.dimension) {
    throw new ConversionError(`cannot convert ${f.dimension} to ${t.dimension}`);
  }
  return (value * f.toBase) / t.toBase;
}
