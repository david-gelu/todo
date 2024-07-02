'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState } from "react"
import getTodos from "@/pages/api/todos"

const Home = () => {
  const [dataUpdated, setDataUpdated] = useState<todoType[]>([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/todos')
        const data = await response.json()
        setDataUpdated(data)
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    }
    fetchData()
  }, [refresh])


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
