"use client"
import { ReactNode } from "react"

const Button = (props:
    {
        type?: "button" | 'submit' | 'reset',
        text: string | ReactNode,
        className?: string
        onClick?: () => void,
        actionButton?: boolean
    }) => {

    const { type, text, className, onClick, actionButton } = props

    return (
        <>
            <button
                onClick={onClick}
                type={type}
                className={`${className} ${actionButton ? 'action-btn' : ''} `}
            >{text}</button>
        </>
    )
}

export default Button