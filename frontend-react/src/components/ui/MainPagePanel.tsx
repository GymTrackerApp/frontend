import React from "react";
import { Link } from "react-router";
import Button from "./Button";

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
    <div className="w-full bg-components-main p-2 pb-5 my-2">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {detailsPageLink && (
          <Link to={detailsPageLink}>
            <Button
              btnStyle={"details"}
              size={"medium"}
              additionalStyle="rounded-xl"
            >
              <span>{detailsPageButtonTitle}</span>
            </Button>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

export default MainPagePanel;
