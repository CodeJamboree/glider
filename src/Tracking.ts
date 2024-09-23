import { Point } from "./Point";

export interface Tracking extends Point {
  key: string,
  changed: boolean
}