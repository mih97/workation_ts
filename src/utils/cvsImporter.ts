import fs from "fs";

import { parse } from "csv-parse";

export async function loadCsv<T>(
  filePath: string,
  mapper: (row: Record<string, string>) => T
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const records: T[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row: Record<string, string>) => {
        try {
          records.push(mapper(row));
        } catch (err) {
          reject(err);
        }
      })
      .on("end", () => resolve(records))
      .on("error", reject);
  });
}