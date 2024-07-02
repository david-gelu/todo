"use client";

import { useRef } from "react";
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
    const ref = useRef<HTMLFormElement>(null);
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            await action(formData);
            ref.current?.reset();
        } catch (error) {
            console.error('Error performing action:', error);
        }
    };
    return (
        <form
            style={{ lineHeight: 0, cursor: "pointer", width: '100%' }}
            className={className}
            onSubmit={handleSubmit}
            ref={ref}
            action={async (formData) => {
                await action(formData);
                ref.current?.reset();
            }}
        >
            {children}
        </form>
    );
};

export default Form;
