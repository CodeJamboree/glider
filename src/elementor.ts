export default (element: HTMLElement, className: string) => {
  const hasClass = className.trim() !== '';
  const { classList, style } = element;

  const classy = (apply: boolean) => {
    if (!hasClass) return;
    apply ? classList.add(className) : classList.remove(className);
  }
  const setA = (name: string, value: string) =>
    element.setAttribute(name, value);
  const hasA = (name: string) =>
    element.hasAttribute(name);
  const getA = (name: string) =>
    element.getAttribute(name);
  const delA = (attribute: string) =>
    element.removeAttribute(attribute);
  const delAwith = (name: string, value: string) => {
    if (getA(name) !== value) return;
    delA(name);
  }

  const clearPriorTimeout = (name: string) => {
    if (!hasA(name)) return;
    const id = getA(name);
    if (id !== null) clearTimeout(parseInt(id, 10));
    delA(name);
  }

  const preserveStyle = (name: string) => {
    if (hasA(name)) return;
    const { transform, transition } = style;
    const backup = [transition, transform];
    setA(name, JSON.stringify(backup));
  }

  const restoreStyle = (name: string) => {
    const json = getA(name);
    delA(name);
    if (typeof json !== 'string') return;
    const [transition, transform] = JSON.parse(json) as string[];
    setStyles(transition, transform);
  }
  const transitioner = (ms: number) => `transform ${ms}ms`;
  const jumpToPriorLocation = (x: number, y: number) => {
    setStyles(transitioner(0), `translate(${x}px, ${y}px)`);
  }

  const glideToNextLocation = (ms: number) => {
    setStyles(transitioner(ms), '');
  }

  const setStyles = (transition: string, transform: string) => {
    style.transition = transition;
    style.transform = transform;
  }

  return {
    get: getA,
    set: setA,
    del: delA,
    delWith: delAwith,
    classy,
    backup: preserveStyle,
    restore: restoreStyle,
    jump: jumpToPriorLocation,
    glide: glideToNextLocation,
    clearPrior: clearPriorTimeout
  }
}