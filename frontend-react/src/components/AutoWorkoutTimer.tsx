import React, { useEffect } from "react";

const AutoWorkoutTimer = () => {
  const [seconds, setSeconds] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  };

  return <p className="text-lg">{displayTime(seconds)}</p>;
};

export default AutoWorkoutTimer;
