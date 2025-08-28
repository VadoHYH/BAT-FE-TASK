"use client";
import { useState } from "react";

const batMobileSum = (N) => {

  if (N % 2 === 0) {
    return N / 2 + 2;
  }

  else {
    return (3 - N) / 2;
  }
};

export default function Test1() {
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {

    const num = Number(n);


    if (!Number.isInteger(num) || num < 1) {
      setResult("請輸入有效的正整數");
      return;
    }

    const sum = batMobileSum(num);
    setResult(`數列總和：${sum}`);
  };

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-xl font-bold mb-4">題目 1：數列求和</h1>
      <input
        type="number"
        value={n}
        onChange={(e) => setN(e.target.value)}
        placeholder="輸入 N"
        className="border px-4 py-2 mb-4"
      />
      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        計算
      </button>
      {result && <p className="mt-4">{result}</p>}
    </main>
  );
}