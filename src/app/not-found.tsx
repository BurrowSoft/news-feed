import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-slate-500">Page not found.</p>
      <Link href="/" className="text-indigo-600 hover:underline">
        Back to headlines
      </Link>
    </div>
  );
}
