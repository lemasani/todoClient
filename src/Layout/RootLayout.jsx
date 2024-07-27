import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 w-64 bg-gray-800 text-white p-4 transition-transform duration-200 ease-in-out`}
      >
        <header className="text-xl font-bold">Dasky</header>
        <nav className='mt-10'>
          <ul>
            <li className="mb-2">
              <a
                href="/dashboard"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/history"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                History
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/profile"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-gray-800 text-white md:hidden flex justify-end">
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isSidebarOpen ? 'Close' : 'Menu'}
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
