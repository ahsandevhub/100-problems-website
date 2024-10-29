"use client";

import { useEffect, useState } from "react";
import { GiPin } from "react-icons/gi";
import { MdOutlineDoneAll } from "react-icons/md";

export default function Home() {
  const [progress, setProgress] = useState(Array(30).fill(0)); // Initialize with 30 days of progress
  const [totalSolved, setTotalSolved] = useState(0);
  const startDate = new Date("2024-10-27");
  const today = new Date();

  useEffect(() => {
    // Load initial progress data
    fetch("/api/progress")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setProgress(data.progress);
        calculateTotalSolved(data.progress);
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
      });
  }, []);

  const calculateTotalSolved = (progressArray) => {
    const total = progressArray.reduce((acc, curr) => acc + curr, 0);
    setTotalSolved(total);
  };

  const handleProgressChange = (dayIndex, value) => {
    const newProgress = [...progress];
    newProgress[dayIndex] = Math.max(0, Math.min(10, value)); // Ensure value is between 0 and 5
    setProgress(newProgress);
    calculateTotalSolved(newProgress);

    // Save progress to the server
    fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ progress: newProgress }),
    }).catch((error) => {
      console.error("Error saving progress:", error);
    });
  };

  const getBoxClassName = (index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    // Normalize date for comparison (set time to 00:00:00)
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (normalizedDate < normalizedToday) {
      return "bg-orange-50 shadow-orange-600/50 border-orange-500 *:border-orange-500 text-orange-500 *:text-orange-500"; // Past dates
    } else if (
      normalizedDate.toDateString() === normalizedToday.toDateString()
    ) {
      return "bg-green-50 border-2 scale-105 shadow-green-600/50 border-green-500 *:border-green-500 text-green-600 *:text-green-600"; // Today's date
    }
    return "bg-white opacity-50 cursor-not-allowed"; // Future dates
  };

  return (
    <div className="container mx-auto rounded-xl border-2 border-slate-200/30 shadow-xl flex flex-col p-12 gap-8 items-center bg-gray-500/50 backdrop-blur-lg">
      <h1 className="text-3xl text-orange-500 drop-shadow-lg font-bold">
        100 Problems Solve Challenge in 30 days!
      </h1>
      <div className="mb-3 p-3 gap-4 flex items-center rounded-md bg-orange-100/50 border border-slate-200/30 w-full max-w-4xl">
        <h2 className="font-bold text-slate-800 flex-none">
          Progress {totalSolved}/100
        </h2>
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-300">
          <div
            className="bg-orange-400 transition-all h-full"
            style={{ width: `${(totalSolved / 100) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4 gap-y-5">
        {progress.map((value, index) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + index); // Corrected Date calculation

          // Normalize date for comparison
          const isToday = date.toDateString() === today.toDateString();
          const isPassed = date < today;

          return (
            <div
              key={index}
              className={`flex flex-col shadow-lg border-2 rounded items-center ${getBoxClassName(
                index
              )}`}
            >
              <div className="relative top p-2 gap-3 flex">
                <div className="left">
                  <p className="font-medium pb-2">{`Day ${index + 1}`}</p>
                  <label htmlFor="qty" className="text-sm">
                    Solved:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) =>
                      handleProgressChange(index, parseInt(e.target.value))
                    }
                    disabled={!isToday} // Only enable input for today
                    className="text-center w-14 block border border-gray-300 rounded"
                  />
                </div>
                <div className="h-18 w-8 bg-gray-300 rounded overflow-hidden relative over">
                  <div
                    className={`absolute bottom-0 transition-all ${
                      isToday ? "bg-green-500" : "bg-orange-500"
                    }`}
                    style={{ height: `${(value / 5) * 100}%`, width: "100%" }}
                  ></div>
                </div>
                {isPassed && (
                  <div className="absolute -left-2 -top-2 bg-white p-1 text-emerald-500 rounded-full border-2 border-green-500 shadow-md shadow-green-500/50">
                    <MdOutlineDoneAll className="text-sm" />
                  </div>
                )}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -top-3 ${
                    isToday
                      ? "text-red-500"
                      : isPassed
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  <GiPin className="text-xl" />
                </div>
              </div>
              <p className="border-t w-full text-center text-sm py-1 text-gray-600">
                {`${date
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "-")}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
