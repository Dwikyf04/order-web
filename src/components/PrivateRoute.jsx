import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  getCurrentAdmin,
  subscribeToAuth,
} from "../infrastructure/auth/authRepository";

export default function PrivateRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session saja tidak cukup; role admin diverifikasi dari database.
    getCurrentAdmin()
      .then((admin) => setSession(admin ? { admin } : null))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));

    // 2. Dengarkan perubahan auth (misal logout)
    const unsubscribe = subscribeToAuth((_event, session) => {
      if (!session) {
        setSession(null);
        return;
      }
      getCurrentAdmin()
        .then((admin) => setSession(admin ? { admin } : null))
        .catch(() => setSession(null));
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memeriksa akses...</p>
      </div>
    );
  }

  // Jika ada session (login), tampilkan konten (Outlet).
  // Jika tidak, lempar ke /login.
  return session ? <Outlet /> : <Navigate to="/login" replace />;
}
