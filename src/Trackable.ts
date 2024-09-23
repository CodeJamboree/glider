import { ReactElement, RefObject } from "react";

export type Trackable = ReactElement<HTMLElement> &
{
  ref: RefObject<HTMLElement>,
  key: string
} & {
  ref: {
    current: NonNullable<HTMLElement>
  }
};