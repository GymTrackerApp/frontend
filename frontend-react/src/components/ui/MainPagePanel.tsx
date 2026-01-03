import React from "react";
import { Link } from "react-router";

interface MainPagePanelProps {
  title: string;
  detailsPageLink?: string;
  detailsPageButtonTitle?: string;
  children: React.ReactNode;
}

const MainPagePanel = ({
  title,
  detailsPageLink,
  detailsPageButtonTitle,
  children,
}: MainPagePanelProps) => {
  return (
    <div className="w-full bg-components-main p-2 pb-5 my-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {detailsPageLink && (
          <Link to={detailsPageLink}>
            <button className="px-2 py-1 border-2 text-blue-500 border-blue-500 rounded-xl cursor-pointer hover:border-blue-400 hover:text-blue-400 transition-colors">
              {detailsPageButtonTitle}
            </button>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

export default MainPagePanel;
