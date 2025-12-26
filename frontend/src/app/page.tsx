export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            シンプル会計帳簿
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            個人事業主向けの会計アプリケーション
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              フロントエンド
            </h2>
            <p className="text-gray-600">
              Next.js 15 + TypeScript + Tailwind CSS
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              バックエンド
            </h2>
            <p className="text-gray-600">
              Go (Golang) 1.21 REST API
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              データベース
            </h2>
            <p className="text-gray-600">
              MySQL 8.0
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            開始方法
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Docker Desktopをインストール</li>
            <li>プロジェクトルートで <code className="bg-gray-100 px-2 py-1 rounded">docker-compose up -d</code> を実行</li>
            <li>ブラウザで <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code> にアクセス</li>
          </ol>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            APIステータス
          </h3>
          <p className="text-blue-700">
            バックエンドAPI: <a href="http://localhost:8080/api/health" className="underline" target="_blank" rel="noopener noreferrer">http://localhost:8080/api/health</a>
          </p>
        </div>
      </div>
    </div>
  );
}
