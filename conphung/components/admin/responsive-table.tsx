'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => ReactNode
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
}

export function ResponsiveTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'Không có dữ liệu',
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 dark:bg-gray-800">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="text-left p-4 font-semibold text-sm"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="p-4">
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <Card
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={onRowClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
          >
            <CardContent className="p-4 space-y-3">
              {columns.map((column) => (
                <div key={String(column.key)} className="flex justify-between items-start">
                  <span className="font-medium text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
                    {column.label}:
                  </span>
                  <span className="text-sm text-right flex-1">
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] || '-')}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
