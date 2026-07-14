#!/usr/bin/env node
import { convert, ConversionError } from "./convert";

function main(argv: string[]): number {
  const [value, from, , to] = argv; // usage: unitkit 5 km in miles
  if (!value || !from || !to) {
    console.error("usage: unitkit <value> <from> in <to>");
    return 2;
  }
  const n = Number(value);
  if (Number.isNaN(n)) {
    console.error(`not a number: ${value}`);
    return 2;
  }
  try {
    const result = convert(n, from, to);
    console.log(`${n} ${from} = ${result.toFixed(4)} ${to}`);
    return 0;
  } catch (e) {
    if (e instanceof ConversionError) {
      console.error(e.message);
      return 1;
    }
    throw e;
  }
}

process.exit(main(process.argv.slice(2)));
