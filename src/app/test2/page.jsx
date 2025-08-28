"use client";
import { useState } from "react";

export default function Test2() {
  const initialPool = [1, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  const [pool, setPool] = useState(initialPool);
  const [log, setLog] = useState([]);

  const handleDraw = () => {
    if (pool.length === 0) return;
    const index = Math.floor(Math.random() * pool.length);
    const prize = pool[index];
    const newPool = [...pool];
    newPool.splice(index, 1);
    setPool(newPool);
    setLog((prev) => [`抽到 ${prize} 號獎，剩下：${newPool.join(", ")}`, ...prev]);
  };

  const handleReset = () => {
    setPool(initialPool);
    setLog([]);
  };

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-xl font-bold mb-4">題目 2：抽獎模擬器</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleDraw}
          disabled={pool.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          抽獎
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          重置
        </button>
      </div>
      {pool.length === 0 && <p className="text-red-500">禮物箱已空！</p>}
      <div className="w-full max-w-md border p-4 h-64 overflow-auto">
        {log.map((item, index) => (
          <p key={index} className="mb-2">{item}</p>
        ))}
      </div>
    </main>
  );
}
