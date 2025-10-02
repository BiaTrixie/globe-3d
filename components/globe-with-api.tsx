"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useMarkersFromFile } from "@/hooks/use-markers-api";

const World = dynamic(() => import("./ui/globe").then((m) => m.World), {
  ssr: true,
});

export default function GlobeWithApi() {
  const { markers, arcs, loading, error, statistics } = useMarkersFromFile();

  const globeConfig = {
    pointSize: 0.8,
    globeColor: "#2B0957",
    showAtmosphere: true,
    atmosphereColor: "#A25CFA",
    atmosphereAltitude: 0.15,
    emissive: "#2B0957",
    emissiveIntensity: 0.2,
    shininess: 0.9,
    polygonColor: "#FFF",
    ambientLight: "#F8F9FE",
    directionalLeftLight: "#B89EFF",
    directionalTopLight: "#A25CFA",
    pointLight: "#A6FA45",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto relative w-full">
        <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white">Carregando marcadores do globo...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto relative w-full">
        <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-white text-xl mb-2">Erro ao carregar dados</p>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto relative w-full">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          {/* Estatísticas do globo */}
          {statistics && (
            <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-2">Estatísticas do Globo</h3>
              <div className="space-y-1 text-sm">
                <p>📍 {statistics.totalMarkers} marcadores</p>
                <p>🔗 {statistics.totalConnections} conexões</p>
                <p>🌍 {Object.keys(statistics.regions).length} regiões</p>
              </div>
            </div>
          )}

          {/* Lista de marcadores */}
          <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2">Marcadores ({markers.length})</h3>
            <div className="space-y-2 text-sm max-h-80 overflow-y-auto">
              {markers.slice(0, 10).map((marker) => (
                <div key={marker.id} className="border-b border-gray-600 pb-2">
                  <p className="font-semibold">{marker.name}</p>
                  <p className="text-gray-300 text-xs">{marker.country}</p>
                  <p className="text-gray-400 text-xs">
                    {marker.connections.length} conexões
                  </p>
                </div>
              ))}
              {markers.length > 10 && (
                <p className="text-gray-400 text-xs">
                  ... e mais {markers.length - 10} marcadores
                </p>
              )}
            </div>
          </div>
        </motion.div>
        
        <div className="absolute w-full h-72 md:h-full z-10">
          <World data={arcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
