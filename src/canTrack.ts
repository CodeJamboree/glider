import { ReactNode, isValidElement } from "react";
import { Trackable } from "./Trackable";

export default (child: ReactNode): child is Trackable => {
  if (!isValidElement(child)) return false;
  if (child.key === null) return false;

  if (!('ref' in child) ||
    typeof child.ref !== 'object' ||
    child.ref === null ||
    !('current' in child.ref) ||
    child.ref.current === null ||
    typeof child.ref.current !== 'object' ||
    !('style' in child.ref.current)
  ) return false;

  return true;
}