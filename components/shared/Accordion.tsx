import { useState } from "react";
import { todoType } from "@/types/todoTypes";

interface AccordionProps {
  title: string;
  todos: todoType[];
  children?: React.ReactNode;
}

function hasIncomplete(todos: todoType[]) {
  return todos.some((todo) => !todo.isCompleted);
}

export const Accordion = ({ title, todos, children }: AccordionProps) => {
  const [open, setOpen] = useState(hasIncomplete(todos)); // open if any todo is incomplete

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
};