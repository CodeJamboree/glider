import { FC, ReactNode, useLayoutEffect, useState } from "react";
import canTrack from "./canTrack";
import { Tracking } from "./Tracking";
import childProcessor from "./childProcessor";

export const Glider: FC<{
  ms?: number,
  className?: string,
  children: ReactNode
}> = ({
  ms = 500,
  className = 'glider',
  children
}) => {

    const [tracking, setTracking] = useState<Tracking[]>([]);

    useLayoutEffect(() => {
      if (!Array.isArray(children)) return;
      const tracked = children
        .filter(canTrack)
        .map(childProcessor(ms, className, tracking));

      if (tracked.some(({ changed }) => changed)) {
        setTracking(tracked);
      }
    }, [children]);

    return children;

  }
