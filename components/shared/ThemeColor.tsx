import { FaMoon, FaSun } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import Button from "../ui/Button";

const ThemeColor = () => {
  const [theme, setTheme] = useState(true)

  useEffect(() => {
    const darkMode = localStorage.getItem('dark-mode')

    if (darkMode === null) {
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = prefersDarkScheme ? 'enabled' : 'disabled'
      localStorage.setItem('dark-mode', initialTheme)
      setTheme(initialTheme === 'enabled')
    } else {
      setTheme(darkMode === 'enabled')
    }
  }, [])

  useEffect(() => {
    const themeData = document.querySelector('[data-theme]') as HTMLElement
    themeData.dataset.theme = theme ? 'dark' : 'light'
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = !prevTheme
      localStorage.setItem('dark-mode', newTheme ? 'enabled' : 'disabled')
      return newTheme
    })
  }
  return (
    <Button
      className='ms-auto theme'
      style={{ border: '1px solid var(--color-text)' }}
      onClick={() => toggleTheme()}
      text={theme ? <FaMoon className="todo-icon" /> : <FaSun className="todo-icon" />}
    />
  )
}

export default ThemeColor
