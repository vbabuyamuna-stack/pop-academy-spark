import DaisyButton from "./DaisyButton";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return <DaisyButton ref={ref} {...props}>{children}</DaisyButton>;
  },
);

Button.displayName = "Button";

export { Button };
