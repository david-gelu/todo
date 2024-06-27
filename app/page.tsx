import AddToDo from "@/components/shared/AddToDo";
import styles from "./page.module.css";
import { ToDo } from "@/components/shared/ToDo";
import { prisma } from '@/utils/prisma'

async function getData() {
  const data = await prisma.todo.findMany({
    select: {
      title: true,
      id: true,
      isCompleted: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return data
}


const Home = async () => {
  const data = await getData()
  return (
    <main className={styles.main}>
      <AddToDo />
      <div style={{ width: '100%' }}>
        {data.map((todo, id) => (
          <ToDo todo={todo} key={id} />
        ))}
      </div>
    </main>
  );
}
export default Home