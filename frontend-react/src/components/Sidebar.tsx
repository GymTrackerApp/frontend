import clsx from "clsx";
import {
  FaChartLine,
  FaCog,
  FaDumbbell,
  FaListAlt,
  FaThLarge,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink } from "react-router";

interface SidebarProps {
  username: string | undefined;
  isOpen: boolean;
}

const Sidebar = ({ username, isOpen }: SidebarProps) => {
  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    );

  return (
    <aside
      className={clsx(
        "fixed h-full w-72 z-11 flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 transition-transform duration-300 md:translate-x-0 md:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-blue-900/20">
            <FaDumbbell className="w-7 h-7 rotate-45" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-white">
              Gym Tracker
            </h1>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink className={linkStyles} to="/">
            <FaThLarge size={24} />
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>
          <NavLink className={linkStyles} to="/plan-manager">
            <FaListAlt size={24} />
            <span className="text-sm font-medium">Plans</span>
          </NavLink>
          <NavLink className={linkStyles} to="/progress">
            <FaChartLine size={24} />
            <span className="text-sm font-medium">Progress</span>
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800 pt-6">
        <NavLink className={linkStyles} to="/profile">
          <FaCog size={20} />
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <FaUserCircle className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            {username ? (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {username}
              </span>
            ) : (
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-skeleton"></div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
