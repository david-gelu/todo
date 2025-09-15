'use client'

import { ToDo } from "./ToDo"
import { todoType } from "@/types/todoTypes"
import { useMemo, useEffect } from "react"
import { useTodos } from '@/hooks/useTodos'
import { useQueryClient } from '@tanstack/react-query'
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

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
      if (sortType === 'incomplete') {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
      }
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

    const getVisiblePages = (current: number, total: number) => {
      if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);

      if (current <= 2) return [1, 2, 3];
      if (current >= total - 1) return [total - 2, total - 1, total];

      return [current - 1, current, current + 1];
    };

    const visiblePages = getVisiblePages(currentPage, data.totalPages);

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="pagination-button"
          style={{ padding: 0 }}
        >
          <MdKeyboardDoubleArrowLeft />
        </button>

        {currentPage > 2 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="pagination-button"
            >
              1
            </button>
            {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {visiblePages.map(pageNumber => (
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
        ))}

        {currentPage < data.totalPages - 1 && (
          <>
            {currentPage < data.totalPages - 2 && <span className="pagination-ellipsis">...</span>}
            <button
              onClick={() => setCurrentPage(data.totalPages)}
              className="pagination-button"
            >
              {data.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
          onMouseEnter={prefetchNextPage}
          disabled={currentPage >= data.totalPages}
          className="pagination-button"
          style={{ padding: 0 }}
        >
          <MdKeyboardDoubleArrowRight />
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