import { useCallback } from "react";

export function App(): React.ReactElement {
  const handleGreet = useCallback(() => {
    console.log("Welcome to Farm-Link Zambia");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Farm-Link Zambia
          </h1>
          <p className="text-xl text-gray-600">
            Agricultural Platform for Zambian Farmers
          </p>
          <button
            onClick={handleGreet}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
