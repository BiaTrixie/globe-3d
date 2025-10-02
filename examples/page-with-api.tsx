"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useMarkersFromFile } from "@/hooks/use-markers-api";

const World = dynamic(() => import("../components/ui/globe").then((m) => m.World), {
  ssr: true,
});

export default function HomeWithApi() {
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
              <p className="text-white text-lg">Carregando marcadores do globo...</p>
              <p className="text-gray-400 text-sm mt-2">Conectando com a API de dados geográficos</p>
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
              <p className="text-gray-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                Tentar Novamente
              </button>
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
          {/* Painel de estatísticas */}
          {statistics && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md rounded-xl p-6 text-white border border-white/10"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center">
                🌍 Estatísticas do Globo
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">📍 Marcadores:</span>
                  <span className="font-semibold text-green-400">{statistics.totalMarkers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">🔗 Conexões:</span>
                  <span className="font-semibold text-blue-400">{statistics.totalConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">🌎 Regiões:</span>
                  <span className="font-semibold text-purple-400">{Object.keys(statistics.regions).length}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lista de marcadores */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md rounded-xl p-6 text-white border border-white/10 max-h-96 overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-3 flex items-center">
              📍 Marcadores ({markers.length})
            </h3>
            <div className="space-y-3 text-sm max-h-80 overflow-y-auto">
              {markers.slice(0, 8).map((marker) => (
                <div key={marker.id} className="border-b border-white/20 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-white">{marker.name}</p>
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                      {marker.type}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">{marker.country}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-400 text-xs">
                      {marker.connections.length} conexões
                    </p>
                    <p className="text-gray-500 text-xs">
                      {marker.population.toLocaleString()} hab
                    </p>
                  </div>
                </div>
              ))}
              {markers.length > 8 && (
                <div className="text-center pt-2">
                  <p className="text-gray-400 text-xs">
                    ... e mais {markers.length - 8} marcadores
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Informações adicionais */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md rounded-xl p-4 text-white border border-white/10"
          >
            <p className="text-sm text-gray-300">
              Dados carregados via API • {new Date().toLocaleString('pt-BR')}
            </p>
          </motion.div>
        </motion.div>
        
        <div className="absolute w-full h-72 md:h-full z-10">
          <World data={arcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
