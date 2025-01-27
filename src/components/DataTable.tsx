import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  width: number;
}

interface TableProps {
  data: any[];
  columns: Column[];
}

export const DataTable: React.FC<TableProps> = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})
  );
  const itemsPerPage = 5;

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleColumnResize = (key: string, width: number) => {
    setColumnWidths((prev) => ({ ...prev, [key]: Math.max(100, width) }));
  };

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data
      .map((row) => columns.map((col) => row[col.key]).join(","))
      .join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-table.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, searchTerm, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  return (
    <div className="w-full space-y-6 bg-gray-900 text-white rounded-xl p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search in all columns..."
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button
          onClick={exportToCSV}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <Download className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden border border-gray-700 rounded-xl shadow-sm bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="relative px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer select-none border-b border-gray-700"
                    style={{ width: `${columnWidths[column.key]}px` }}
                  >
                    <div className="flex flex-col gap-3">
                      <span
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-2 hover:text-gray-100 transition-colors duration-200"
                      >
                        {column.label}
                        <ArrowUpDown className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder={`Filter ${column.label.toLowerCase()}...`}
                        className="bg-gray-800 px-3 py-1.5 text-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={filters[column.key] || ""}
                        onChange={(e) =>
                          handleFilter(column.key, e.target.value)
                        }
                      />
                    </div>
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-700 opacity-0 hover:opacity-100 transition-opacity duration-200"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths[column.key];

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const diff = moveEvent.pageX - startX;
                          handleColumnResize(column.key, startWidth + diff);
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener(
                            "mousemove",
                            handleMouseMove
                          );
                          document.removeEventListener(
                            "mouseup",
                            handleMouseUp
                          );
                        };

                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-700/50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                      style={{ width: `${columnWidths[column.key]}px` }}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <span className="text-sm text-gray-400 order-2 sm:order-1">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}{" "}
          of {filteredAndSortedData.length} entries
        </span>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg">
              {currentPage}/{totalPages}
            </span>
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};