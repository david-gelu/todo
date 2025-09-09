'use client'

import { ToDo } from "./ToDo"
import { todoType } from "@/types/todoTypes"
import { useMemo, useEffect } from "react"
import { useTodos } from '@/hooks/useTodos'
import { useQueryClient } from '@tanstack/react-query'

interface TodoContainerProps {
  search: string
  sortType: 'date' | 'incomplete'
  currentPage: number
  setCurrentPage: (page: number) => void
  openGroups: Record<string, boolean>
  handleToggle: (date: string) => void
}

export const TodoContainer = ({
  search,
  sortType,
  currentPage,
  setCurrentPage,
  openGroups,
  handleToggle
}: TodoContainerProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useTodos(search, currentPage);

  // Prefetch next page
  useEffect(() => {
    if (data?.totalPages && currentPage < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['todos', search, currentPage + 1],
        queryFn: () =>
          fetch(`/api/todos?search=${encodeURIComponent(search)}&page=${currentPage + 1}&limit=40`)
            .then(res => res.json())
      });
    }
  }, [currentPage, data?.totalPages, queryClient, search]);

  const sortedTodos = useMemo(() => {
    if (!data?.todos) return [];

    return [...data.todos].sort((a, b) => {
      // First sort by completion status if sortType is 'incomplete'
      if (sortType === 'incomplete') {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
      }
      // Then sort by date (either as primary sort or as secondary sort)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data?.todos, sortType]);

  const groupedTodos = useMemo(() => {
    if (!sortedTodos.length) return {};

    return sortedTodos.reduce((acc, todo) => {
      if (!todo?.createdAt) return acc;
      const date = new Date(todo.createdAt).toLocaleDateString('ro-RO');
      if (!acc[date]) acc[date] = [];
      acc[date].push(todo);
      return acc;
    }, {} as Record<string, todoType[]>);
  }, [sortedTodos]);

  const prefetchNextPage = () => {
    if (data?.totalPages && currentPage < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['todos', search, currentPage + 1],
        queryFn: () =>
          fetch(`/api/todos?search=${encodeURIComponent(search)}&page=${currentPage + 1}&limit=40`)
            .then(res => res.json())
      });
    }
  };

  const renderPagination = () => {
    if (!data?.totalPages) return null;

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="pagination-button"
        >
          Previous
        </button>

        {[...Array(data.totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              onMouseEnter={() => {
                if (pageNumber !== currentPage) {
                  queryClient.prefetchQuery({
                    queryKey: ['todos', search, pageNumber],
                    queryFn: () =>
                      fetch(`/api/todos?search=${encodeURIComponent(search)}&page=${pageNumber}&limit=40`)
                        .then(res => res.json())
                  });
                }
              }}
              className={`pagination-button ${pageNumber === currentPage ? 'active' : ''}`}
              disabled={pageNumber === currentPage}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
          onMouseEnter={prefetchNextPage}
          disabled={currentPage >= data.totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading) return <div className="loader">Se încarcă...</div>;

  return (
    <>
      {renderPagination()}
      <div className="todo-container">
        {Object.entries(groupedTodos).map(([date, todos], groupIndex, arr) => {
          const isLastGroup = groupIndex === arr.length - 1;

          return (
            <details
              key={date}
              open={openGroups[date]}
              className="details-accordion"
            >
              <summary
                className="details-summary"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(date);
                }}
              >
                {date}
                <span className="details-arrow">
                  {openGroups[date] ? "▲" : "▼"}
                </span>
              </summary>
              <div className="todo-accordion-body">
                {todos.map((todo, index) => {
                  const isLast = isLastGroup && index === todos.length - 1;
                  return (
                    <div key={todo.id}>
                      <ToDo todo={todo} />
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
};