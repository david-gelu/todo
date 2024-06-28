"use client"

import React from 'react'

const Input = (
    props: {
        name?: string,
        type?: string,
        placeholder?: string,
        value?: string
    }) => {

    const { name, type, placeholder, value } = props
    return (
        <>
            <input className='input'
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
            />
        </>
    )
}

export default Input