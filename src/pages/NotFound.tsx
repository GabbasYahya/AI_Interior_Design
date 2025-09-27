import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white backdrop-blur-md shadow-elegant">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Erreur</p>
        <h1 className="mt-2 text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg text-white/70">
          Oups, la page que vous cherchez semble avoir été redessinée ailleurs.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-gradient-warm px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:-translate-y-1"
        >
          Retourner à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
