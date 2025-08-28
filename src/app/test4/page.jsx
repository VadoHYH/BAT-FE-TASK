export default function Test4() {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">題目 4：聊天室組件設計</h1>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">一、組件結構</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {`ChatRoom
            ├── Header
            ├── MessageList
            │    └── MessageItem
            ├── TypingIndicator
            └── MessageInput`}
          </pre>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">二、狀態設計</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>messages：</strong> 存放訊息資料（ChatRoom 管理）</li>
            <li><strong>isTyping：</strong> 對方是否輸入中（ChatRoom 管理）</li>
            <li><strong>readStatus：</strong> 每則訊息物件內屬性，由 MessageItem 顯示</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">三、狀態流向</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>MessageInput 發送訊息 → ChatRoom 更新 messages → MessageList 渲染</li>
            <li>WebSocket 更新 isTyping → ChatRoom 傳給 TypingIndicator</li>
            <li>已讀狀態由 ChatRoom 控制，props 傳給 MessageItem</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">四、未來擴充建議</h2>
          <p>
            使用 Context 或 Redux 管理聊天室全域狀態，並整合 WebSocket 實現即時同步。
          </p>
        </section>
      </main>
    );
  }
  