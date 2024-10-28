"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [progress, setProgress] = useState(Array(30).fill(0)); // Initialize with 30 days of progress
  const [totalSolved, setTotalSolved] = useState(0);
  const startDate = new Date("2024-10-27");
  const today = new Date(); // Current date

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
    newProgress[dayIndex] = Math.max(0, Math.min(5, value)); // Ensure value is between 0 and 5
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
      return "bg-amber-50"; // Past dates
    } else if (
      normalizedDate.toDateString() === normalizedToday.toDateString()
    ) {
      return "bg-green-50 border-2 border-green-500"; // Today's date
    }
    return "bg-white"; // Future dates
  };

  return (
    <div className="flex flex-col bg-slate-50 p-5 space-y-5 items-center">
      <h1 className="text-2xl font-bold">Problem Solving Progress Tracker</h1>
      <div className="mb-3 border p-3 rounded-md bg-white w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-2">
          Total Progress {`${totalSolved} / 100 problems solved`}
        </h2>
        <div className="h-4 bg-gray-300">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${(totalSolved / 100) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4 w-full max-w-4xl">
        {progress.map((value, index) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + index); // Corrected Date calculation

          return (
            <div
              key={index}
              className={`flex flex-col border rounded items-center ${getBoxClassName(
                index
              )}`}
            >
              <div className="top p-3 gap-3 flex">
                <div className="left">
                  <p className="font-medium pb-2">{`Day ${index + 1}`}</p>

                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={value}
                    onChange={(e) =>
                      handleProgressChange(index, parseInt(e.target.value))
                    }
                    className="text-center border border-gray-300 rounded"
                  />
                </div>
                <div className="h-20 w-8 bg-gray-300 relative">
                  <div
                    className="absolute bottom-0 bg-blue-500"
                    style={{ height: `${(value / 5) * 100}%`, width: "100%" }}
                  ></div>
                </div>
              </div>
              <p className="border-t w-full text-center text-sm py-1 text-gray-600">{`${date.toLocaleDateString()}`}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
