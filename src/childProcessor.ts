import glide from "./glide";
import { Point } from "./Point";
import { Trackable } from "./Trackable";
import { Tracking } from "./Tracking";

export default (ms: number, className: string, tracking: Tracking[]) =>
  (child: Trackable): Tracking => {
    const {
      key,
      ref: {
        current: element
      }
    } = child;

    let changed = true;
    const { x, y } = element.getBoundingClientRect();
    const prior = tracking.find(t => t.key === key);
    if (prior) {
      const offset: Point = {
        x: prior.x - x,
        y: prior.y - y
      }
      changed = offset.y !== 0 || offset.x !== 0;
      if (changed) {
        glide(ms, className, element, offset);
      }
    }
    return { key, x, y, changed }
  }