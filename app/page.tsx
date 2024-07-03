'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState, useRef, useCallback } from "react"

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
          d.title?.toLowerCase().includes(search.toLowerCase()) || d.price?.toLowerCase().includes(search.toLowerCase())
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
  // }, []);

  const [height, setHeight] = useState(0);

  const onResize = useCallback(() => {
    if (elementRef.current) setHeight(elementRef.current.clientHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize()
    const elem = document.querySelector(':root') as HTMLElement
    console.log(height)
    elem.style.setProperty('--height', `${height}px`)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [height])

  return (
    <main className={styles.main}>
      <div className="header-container" ref={elementRef}>
        <div className="title-and-search">
          <h1>Add todo app</h1> <input className='input' onChange={(e) => setSearch(e.target.value)} placeholder="Search todos by name or price" style={{ margin: '0.5rem 0 0.5rem auto' }} />
        </div>
        <AddToDo setRefresh={setRefresh} />
      </div>
      <div style={{ width: '100%' }} className="todo-container">
        {dataUpdated.map((todo) => (
          <ToDo setRefresh={setRefresh} todo={todo} key={todo.id} />
        ))}
      </div>
    </main>
  )
}

export default Home
