import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="flex flex-col items-start">
        <h1 className="text-2xl font-bold mb-6">烏龜移動 前端測驗</h1>
        <ul className="space-y-4 list-none p-0">
          <li><Link className="text-blue-500 underline" href="/test1">題目 1：數列求和</Link></li>
          <li><Link className="text-blue-500 underline" href="/test2">題目 2：抽獎模擬器</Link></li>
          <li><Link className="text-blue-500 underline" href="/test4">題目 4：聊天室設計</Link></li>
          <li><Link className="text-blue-500 underline" href="/test5">題目 5：YouBike 即時站點資訊</Link></li>
        </ul>
      </div>
    </main>
  );
}