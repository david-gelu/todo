"use client"
import { ReactNode } from "react"

const Button = (props:
    {
        type?: "button" | 'submit' | 'reset',
        text: string | ReactNode,
        className?: string
        onClick?: () => void,
        actionButton?: boolean
        disabled?: boolean
    }) => {

    const { type, text, className, onClick, actionButton, disabled } = props

    return (
        <>
            <button
                onClick={onClick}
                type={type}
                className={`${className} ${actionButton ? 'action-btn' : ''} `}
                disabled={disabled}
            >{text}</button>
        </>
    )
}

export default Button