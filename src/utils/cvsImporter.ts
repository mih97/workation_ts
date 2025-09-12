import fs from "fs";
import { parse } from "csv-parse";

export async function loadCsv<T = any>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const records: T[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => records.push(row))
      .on("end", () => resolve(records))
      .on("error", reject);
  });
}