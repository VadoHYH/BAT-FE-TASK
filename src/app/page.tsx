export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">蝙蝠移動 前端測驗</h1>
      <ul className="space-y-4">
        <li><a className="text-blue-500 underline" href="/test1">題目 1：數列求和</a></li>
        <li><a className="text-blue-500 underline" href="/test2">題目 2：抽獎模擬器</a></li>
        <li><a className="text-blue-500 underline" href="/test4">題目 4：聊天室設計</a></li>
        <li><a className="text-blue-500 underline" href="/test5">題目 5：YouBike 即時站點資訊</a></li>
      </ul>
    </main>
  );
}
