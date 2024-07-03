'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState } from "react"

const Home = () => {
  const [dataUpdated, setDataUpdated] = useState<todoType[]>([])
  const [refresh, setRefresh] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/todos', { cache: 'no-store' })
        const data = await response.json()
        setDataUpdated(data.filter((d: todoType) =>
          d.title?.toLowerCase().includes(search) || d.price?.toLowerCase().includes(search)
        ))
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    }
    fetchData()
  }, [refresh, search])

  return (
    <main className={styles.main}>
      <div style={{ marginBottom: '1.5rem', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Add todo app</h1> <input className='input' onChange={(e) => setSearch(e.target.value)} placeholder="Search todos by name or price" style={{ minWidth: '16rem', maxWidth: '20rem', margin: '0.5rem 0 0.5rem auto' }} />
      </div>
      <AddToDo setRefresh={setRefresh} />
      <div style={{ width: '100%' }} className="todo-container">
        {dataUpdated.map((todo) => (
          <ToDo setRefresh={setRefresh} todo={todo} key={todo.id} />
        ))}
      </div>
    </main>
  )
}

export default Home
