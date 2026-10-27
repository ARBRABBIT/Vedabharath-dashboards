export type ReturnResolution =
  | { type: "return"; amount: number }
  | { type: "replacement"; driverName: string; driverPhone: string };
