'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Welcome! Choose a section to manage.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/admin/product"
            className="w-full py-4 rounded-lg bg-black text-white text-lg font-semibold text-center hover:bg-neutral-800 transition"
          >
            Manage Products
          </Link>
          <Link
            href=""
            className="w-full py-4 rounded-lg bg-gray-200 text-gray-700 text-lg font-semibold text-center cursor-not-allowed"
            tabIndex={-1}
            aria-disabled="true"
          >
            Manage Orders (Coming Soon)
          </Link>
        </div>
      </div>
    </div>
  );
}
