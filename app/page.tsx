'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { ToDo } from "@/components/shared/ToDo"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState } from "react"

const Home = () => {
  const [dataUpdated, setDataUpdated] = useState<todoType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/todos')
        if (!response.ok) {
          throw new Error('Failed to fetch todos')
        }
        const data = await response.json()
        setDataUpdated(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <main className={styles.main}>
      <AddToDo />
      <div style={{ width: '100%' }}>
        {dataUpdated.map((todo) => (
          <ToDo todo={todo} key={todo.id} />
        ))}
      </div>
    </main>
  )
}

export default Home
