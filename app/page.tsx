'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState } from "react"

const Home = () => {
  const [dataUpdated, setDataUpdated] = useState<todoType[]>([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/todos', { cache: 'no-store' })
        const data = await response.json()
        setDataUpdated(data)
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    }
    fetchData()
  }, [refresh])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    ws.onopen = () => {
      console.log('WebSocket connection established')
    }
    ws.onmessage = (event) => {
      const todos = JSON.parse(event.data)
      setDataUpdated(todos)
    }
    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <main className={styles.main}>
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
