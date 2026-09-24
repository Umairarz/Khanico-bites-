import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-4xl font-extrabold text-charcoal">404</h1>
      <p className="mt-2 text-stone">We couldn't find the page you're looking for.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
