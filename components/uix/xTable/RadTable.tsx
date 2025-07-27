import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, ChevronDown } from 'lucide-react';

interface TableColumn<T> {
  key: keyof T;
  header: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

interface TableState {
  searchQuery: string;
  itemsPerPage: number;
  currentPage: number;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onDelete,
  onView,
}: TableProps<T>) {
  const [state, setState] = useState<TableState>({
    searchQuery: '',
    itemsPerPage: 10,
    currentPage: 1,
  });

  const [filteredData, setFilteredData] = useState<T[]>(data);

  // Filter data based on search query
  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        value
          .toString()
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
    setState((prev) => ({ ...prev, currentPage: 1 }));
  }, [state.searchQuery, data]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / state.itemsPerPage);
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      {/* Table Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.searchQuery}
            onChange={(e) =>
              setState((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            className="rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.itemsPerPage}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                itemsPerPage: Number(e.target.value),
                currentPage: 1,
              }))
            }
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {column.header}
                </th>
              ))}
              {(onDelete || onView) && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {String(item[column.key])}
                  </td>
                ))}
                {(onDelete || onView) && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)}{' '}
          of {filteredData.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            disabled={state.currentPage === 1}
            onClick={() =>
              setState((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
              }))
            }
          >
            Previous
          </button>
          <button
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            disabled={state.currentPage === totalPages}
            onClick={() =>
              setState((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
