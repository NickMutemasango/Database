import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
        {/* Church icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Church Management</h1>
        <p className="text-gray-400 mt-2 text-sm">Family Registration System</p>

        <div className="mt-8 space-y-3">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-md shadow-indigo-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register Your Family
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 w-full bg-white text-indigo-700 border-2 border-indigo-100 py-3.5 px-6 rounded-xl font-semibold hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Admin Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Admin access requires login credentials
        </p>
      </div>
    </main>
  );
}
