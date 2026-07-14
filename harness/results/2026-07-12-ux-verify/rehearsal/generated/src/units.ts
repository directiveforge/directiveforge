export interface UnitDef {
  name: string;
  aliases: string[];
  toBase: number; // factor to the dimension's base unit
  dimension: "length" | "mass" | "temperature";
}

export const UNITS: UnitDef[] = [
  { name: "meter", aliases: ["m", "meters"], toBase: 1, dimension: "length" },
  { name: "kilometer", aliases: ["km"], toBase: 1000, dimension: "length" },
  { name: "mile", aliases: ["mi", "miles"], toBase: 1609.344, dimension: "length" },
  { name: "foot", aliases: ["ft", "feet"], toBase: 0.3048, dimension: "length" },
  { name: "kilogram", aliases: ["kg"], toBase: 1, dimension: "mass" },
  { name: "pound", aliases: ["lb", "lbs"], toBase: 0.45359237, dimension: "mass" },
  { name: "ounce", aliases: ["oz"], toBase: 0.028349523125, dimension: "mass" }
];

export function findUnit(token: string): UnitDef | undefined {
  const t = token.toLowerCase();
  return UNITS.find(u => u.name === t || u.aliases.includes(t));
}
