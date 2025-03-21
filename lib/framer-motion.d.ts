declare module "framer-motion" {
  import * as React from "react";

  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    whileInView?: any;
    viewport?: any;
  }

  type MotionComponentProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & AnimationProps;

  type HTMLMotionComponents = {
    [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
      MotionComponentProps<K> & React.RefAttributes<HTMLElement>
    >;
  };

  export const motion: HTMLMotionComponents;
}

