import { DataTable } from "./components/DataTable";
import { Users } from "lucide-react";

const mockData = [
  {
    id: 1,
    name: "Abhinav",
    email: "abhinav@example.com",
    role: "Developer",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Mukul",
    email: "mukul@example.com",
    role: "Designer",
    status: "Active",
    joinDate: "2024-02-01",
  },
  {
    id: 3,
    name: "Kushagra",
    email: "kushagra@example.com",
    role: "Manager",
    status: "Inactive",
    joinDate: "2023-12-10",
  },
  {
    id: 4,
    name: "Shashwat",
    email: "shashwat@example.com",
    role: "Developer",
    status: "Active",
    joinDate: "2024-01-20",
  },
  {
    id: 5,
    name: "Vivaswan",
    email: "vivaswan@example.com",
    role: "Designer",
    status: "Active",
    joinDate: "2024-02-15",
  },
  {
    id: 6,
    name: "Milind",
    email: "milind@example.com",
    role: "Manager",
    status: "Active",
    joinDate: "2024-01-05",
  },
  {
    id: 7,
    name: "Vasu",
    email: "vasu@example.com",
    role: "Developer",
    status: "Inactive",
    joinDate: "2023-11-30",
  },
];

const columns = [
  { key: "id", label: "ID", width: 100 },
  { key: "name", label: "Name", width: 200 },
  { key: "email", label: "Email", width: 250 },
  { key: "role", label: "Role", width: 150 },
  { key: "status", label: "Status", width: 150 },
  { key: "joinDate", label: "Join Date", width: 150 },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500 text-gray-900 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">
              Path of the Rabbit
            </h1>
            <p className="text-gray-400 mt-1">
              An interactive and dynamic table
            </p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6">
          <DataTable data={mockData} columns={columns} />
        </div>
      </div>
    </div>
  );
}

export default App;