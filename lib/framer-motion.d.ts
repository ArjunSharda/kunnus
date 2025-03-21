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

  type MotionProps = {
    [key: string]: any;
  }

  export interface HTMLMotionProps<T extends HTMLElement> extends 
    React.HTMLAttributes<T>,
    AnimationProps,
    React.RefAttributes<T> {
      children?: React.ReactNode;
  }

  type HTMLMotionComponents = {
    [K in keyof JSX.IntrinsicElements]: React.FC<HTMLMotionProps<any> & JSX.IntrinsicElements[K]>;
  }

  export const motion: HTMLMotionComponents;
}

