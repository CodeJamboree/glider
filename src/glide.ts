import elementor from "./elementor";
import { Point } from "./Point";

export default (
  ms: number,
  className: string,
  element: HTMLElement,
  { x, y }: Point
) => {
  requestAnimationFrame(() => {
    const name = 'data-glide';
    const backupName = `${name}-bak`;
    const timeoutName = `${name}-t`;

    const expiration = (Date.now() + ms).toString();
    const el = elementor(element, className);

    const nextGlideStarted = () => el.get(name) !== expiration;

    el.clearPrior(timeoutName);
    el.backup(backupName);
    el.classy(true);
    el.set(name, expiration);
    el.jump(x, y);

    requestAnimationFrame(() => {

      if (nextGlideStarted()) return;

      el.glide(ms);

      const id = setTimeout(() => {

        if (nextGlideStarted()) return;

        el.delWith(timeoutName, id);
        el.classy(false);
        el.restore(backupName);
        el.del(name);

      }, ms).toString();

      el.set(timeoutName, id);
    });
  })
}

