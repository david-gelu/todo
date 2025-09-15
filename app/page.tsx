'use client'

import AddToDo from "@/components/shared/AddToDo"
import styles from "./page.module.css"
import { todoType } from "@/types/todoTypes"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import ThemeColor from "@/components/shared/ThemeColor"
import { useTodos } from '@/hooks/useTodos';
import { TodoContainer } from "@/components/shared/TodoContainer"
import Input from "@/components/ui/Input"

function groupByDate(todos: todoType[] = []) {
  if (!todos?.length) return {};

  return todos.reduce((acc, todo) => {
    if (!todo?.createdAt) return acc;

    const date = new Date(todo.createdAt).toLocaleDateString('ro-RO');
    if (!acc[date]) acc[date] = [];
    acc[date].push(todo);
    return acc;
  }, {} as Record<string, todoType[]>);
}


const Home = () => {
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState<'date' | 'incomplete'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
  } = useTodos(search, currentPage);

  const allTodos = useMemo(() => {
    if (!data?.todos) return [];

    return [...data.todos].sort((a, b) => {
      if (sortType === 'incomplete') {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data?.todos, sortType]);

  const groupedTodos = useMemo(() => groupByDate(allTodos), [allTodos]);



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
  }, [allTodos])

  const handleToggle = (date: string) => {
    setOpenGroups(prev => ({ ...prev, [date]: !prev[date] }))
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])


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

  if (isLoading) return <div className="loader">Se încarcă...</div>;

  return (
    <main className={`${styles.main} main`}>
      <div className="header-container" ref={elementRef}>
        <div className="title-and-search">
          <div className="title-and-theme">
            <h3>Lista cumparaturi</h3>
            <ThemeColor />
          </div>
          <form style={{ display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label htmlFor="sort">Sortare dupa: </label>
            <select
              name='sort'
              className="input"
              value={sortType}
              onChange={e => setSortType(e.target.value as 'date' | 'incomplete')}
            >
              <option value="date">Data</option>
              <option value="incomplete">Incomplete</option>
            </select>
            <Input
              name="search"
              className="input"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cauta"
            />
          </form>
        </div>
        <AddToDo />
      </div>
      <TodoContainer
        search={search}
        sortType={sortType}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        openGroups={openGroups}
        handleToggle={handleToggle}
      />
    </main>
  );
};

export default Home
