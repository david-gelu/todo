import AddToDo from "@/components/shared/AddToDo";
import styles from "./page.module.css";
import { ToDo } from "@/components/shared/ToDo";
import { prisma } from '@/utils/prisma'
import { todoType } from "@/types/todoTypes";

async function getData() {
  try {
    const data = await prisma?.todo?.findMany({
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

  } catch (error) {
    console.error('Error fetching todos:', error);
  }

}


const Home = async () => {
  const data = await getData()
  return (
    <main className={styles.main}>
      <AddToDo />
      <div style={{ width: '100%' }}>
        {data?.map((todo: todoType) => (
          <ToDo todo={todo} key={todo.id} />
        ))}
      </div>
    </main>
  );
}
export default Home