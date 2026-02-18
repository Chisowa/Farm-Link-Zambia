import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
export function App() {
    const handleGreet = useCallback(() => {
        console.log("Welcome to Farm-Link Zambia");
    }, []);
    return (_jsx("main", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-blue-100", children: _jsx("div", { className: "mx-auto max-w-4xl px-4 py-12", children: _jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900", children: "Welcome to Farm-Link Zambia" }), _jsx("p", { className: "text-xl text-gray-600", children: "Agricultural Platform for Zambian Farmers" }), _jsx("button", { onClick: handleGreet, className: "mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700", children: "Get Started" })] }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map