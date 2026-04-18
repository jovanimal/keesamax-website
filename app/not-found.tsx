import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow">404</p>
        <h1 className="mt-3">Page not found</h1>
        <p className="section-lead mt-4 mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-[var(--color-navy-900)] text-white font-semibold hover:bg-[var(--color-navy-800)] transition"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
