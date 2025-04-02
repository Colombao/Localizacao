"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          await fetch("/api/localizacao", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
        },
        (error) => setError(error.message)
      );
    } else {
      setError("Geolocalização não suportada pelo navegador.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bem-vindo!</h1>
        {location ? (
          <p>
            Comprovante: {location.latitude}, {location.longitude}
          </p>
        ) : (
          <p>Gerando Comprovante...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
