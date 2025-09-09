"use client";

import { ReactNode, forwardRef } from "react";

interface FormProps {
    children: ReactNode;
    action: (formData: FormData) => Promise<void | boolean>;
    className?: string;
    onSubmit?: () => void;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
    ({ children, action, className, onSubmit }, ref) => {
        return (
            <form
                ref={ref}
                style={{ lineHeight: 0, cursor: "pointer", width: "100%" }}
                className={className}
                onSubmit={(e) => {
                    e.preventDefault();
                    action(new FormData(e.currentTarget));
                    onSubmit?.();
                }}
            >
                {children}
            </form>
        );
    }
);

Form.displayName = "Form"; // necesar pentru forwardRef

export default Form;
