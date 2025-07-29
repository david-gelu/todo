'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState, useRef, useCallback } from "react"
import { Accordion } from "@/components/shared/Accordion"
import ThemeColor from "@/components/shared/ThemeColor"

function groupByDate(todos: todoType[]) {
  return todos.reduce((acc, todo) => {
    const date = new Date(todo.createdAt).toLocaleDateString('ro-RO')
    if (!acc[date]) acc[date] = []
    acc[date].push(todo)
    return acc
  }, {} as Record<string, todoType[]>)
}

function isComplete(todo: todoType) {
  // Adaptează la structura ta, aici presupunem că doar title trebuie completat
  return !!todo.title && todo.title.trim() !== ""
}

const Home = () => {
  const [dataUpdated, setDataUpdated] = useState<todoType[]>([])
  const [refresh, setRefresh] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true) // loader state
  const [initialLoading, setInitialLoading] = useState(true)

  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const darkMode = localStorage.getItem('dark-mode')
    if (darkMode === 'enabled' || (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    setLoading(false)
    const fetchData = async () => {
      timeout = setTimeout(() => setLoading(true), 2000)
      try {
        const response = await fetch(`/api/todos?search=${encodeURIComponent(search)}`)
        const data = await response.json()
        setDataUpdated(data)
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        clearTimeout(timeout)
        setLoading(false)
        setInitialLoading(false)
      }
    }
    fetchData()
    return () => clearTimeout(timeout)
  }, [refresh, search])

  const [height, setHeight] = useState(0)

  const onResize = useCallback(() => {
    if (elementRef.current) setHeight(elementRef.current.clientHeight)
  }, [])

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()
    const elem = document.querySelector(':root') as HTMLElement
    elem.style.setProperty('--height', `${height}px`)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [height])

  const [sortType, setSortType] = useState<'date' | 'incomplete'>('date');

  const sortedTodos = [...dataUpdated].sort((a, b) => {
    if (sortType === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const groupedTodos = groupByDate(sortedTodos)

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setOpenGroups(prev => {
      const newState: Record<string, boolean> = { ...prev }
      Object.entries(groupedTodos).forEach(([date, todos]) => {
        if (!(date in newState)) {
          newState[date] = todos.some(todo => !todo.isCompleted)
        }
      })
      Object.keys(newState).forEach(date => {
        if (!(date in groupedTodos)) {
          delete newState[date]
        }
      })
      return newState
    })
  }, [dataUpdated])

  const handleToggle = (date: string) => {
    setOpenGroups(prev => ({ ...prev, [date]: !prev[date] }))
  }

  return (
    <main className={`${styles.main} main`}>
      <div className="header-container" ref={elementRef}>
        <div className="title-and-search">
          <h1>Lista cumparaturi</h1>
          <ThemeColor />
        </div>
        <AddToDo setRefresh={setRefresh} />
        <div style={{ display: 'flex', width: '100%', gap: '1rem', alignItems: 'flex-end' }}>
          <form style={{ margin: '0.5rem 0 0.5rem auto' }} >
            <label htmlFor="sort">Sortare dupa: </label>

            <select
              name='sort'
              className="input"
              style={{ width: 'auto', minWidth: 120 }}
              value={sortType}
              onChange={e => setSortType(e.target.value as 'date' | 'incomplete')}
            >
              <option value="date">Data</option>
              <option value="incomplete">Incomplete</option>
            </select>

          </form>
          <input
            name="search"
            className="input"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cauta dupa nume"
            style={{ margin: '0.5rem 0 0.5rem auto' }}
          />
        </div>
      </div>
      <div className="todo-container">
        {initialLoading || loading ? (
          <div className="loader">Se încarcă...</div>
        ) : (
          Object.entries(groupedTodos).map(([date, todos]) => (
            <details
              key={date}
              open={openGroups[date]}
              className="details-accordion"
            >
              <summary className="details-summary">
                {date}
                <span
                  className="details-arrow"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggle(date)
                  }}
                >
                  {openGroups[date] ? "▲" : "▼"}
                </span>
              </summary>
              <div className="todo-accordion-body">
                {todos.map(todo => (
                  <ToDo key={todo.id} setRefresh={setRefresh} todo={todo} />
                ))}
              </div>
            </details>
          ))
        )}
      </div>
    </main>
  )
}

export default Home
