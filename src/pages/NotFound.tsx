import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => (
  <main className="paper-grid flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Error 404</p>
    <h1 className="mt-4 font-serif text-[28vw] leading-[0.85] text-foreground sm:text-[12rem]">
      4<span className="italic text-flame">0</span>4
    </h1>
    <p className="mt-6 max-w-sm text-lg text-muted-foreground">This page doesn't exist. The path you're looking for isn't on any grid I've searched.</p>
    <Link to="/" className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-flame">
      <ArrowLeft className="h-4 w-4" /> Back to the portfolio
    </Link>
  </main>
);

export default NotFound;
