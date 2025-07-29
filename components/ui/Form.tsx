"use client";

import { ReactNode } from "react";

interface FormProps {
    children: ReactNode;
    action: (formData: FormData) => Promise<void | boolean>;
    className?: string;
    onSubmit?: () => void;
}

const Form = ({
    children,
    action,
    className,
    onSubmit,
}: FormProps) => {
    return (
        <form
            style={{ lineHeight: 0, cursor: "pointer", width: '100%' }}
            className={className}
            onSubmit={e => {
                e.preventDefault();
                action(new FormData(e.target as HTMLFormElement));
            }}
        >
            {children}
        </form>
    );
};

export default Form;
