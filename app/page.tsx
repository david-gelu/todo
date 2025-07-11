'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState, useRef, useCallback } from "react"
import { Accordion } from "@/components/shared/Accordion"

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

  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/todos', { cache: 'no-store' })
        const data = await response.json()
        setDataUpdated(data.filter((d: todoType) =>
          d.title?.toLowerCase().includes(search.toLowerCase())
        ))
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    }
    fetchData()
  }, [refresh, search])

  // useEffect(() => {
  //   if (elementRef.current) {
  //     const elem = document.querySelector(':root') as HTMLElement
  //     elem.style.setProperty('--height', `${elementRef.current.clientHeight}px`)
  //   }
  // }, [])

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

  const sortedTodos = [...dataUpdated].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

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
    <main className={styles.main}>
      <div className="header-container" ref={elementRef}>
        <div className="title-and-search">
          <h1>Lista cumparaturi</h1>
          <input
            className='input'
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search todos by name"
            style={{ margin: '0.5rem 0 0.5rem auto' }}
          />
        </div>
        <AddToDo setRefresh={setRefresh} />
      </div>
      <div style={{ width: '100%' }} className="todo-container">
        {Object.entries(groupedTodos).map(([date, todos]) => (
          <details
            key={date}
            open={openGroups[date]}
            style={{ marginBottom: '1rem', border: '1px solid #ccc', borderRadius: 4, padding: 8 }}
          >
            <summary style={{ fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {date}
              <span
                style={{ cursor: 'pointer', marginLeft: 8 }}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleToggle(date)
                }}
              >
                {openGroups[date] ? "▲" : "▼"}
              </span>
            </summary>
            {todos.map(todo => (
              <ToDo key={todo.id} setRefresh={setRefresh} todo={todo} />
            ))}
          </details>
        ))}
      </div>
    </main>
  )
}

export default Home
