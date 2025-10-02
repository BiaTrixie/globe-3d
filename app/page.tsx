"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
 
const World = dynamic(() => import("../components/ui/globe").then((m) => m.World), {
  ssr: false,
});
 
export default function Home() {
  const globeConfig = {
    pointSize: 0.7, // Aumentei o tamanho dos pontos para São Paulo ficar mais visível
    globeColor: "#2B0957",
    showAtmosphere: true,
    atmosphereColor: "#A25CFA",
    atmosphereAltitude: 0.15,
    emissive: "#2B0957",
    emissiveIntensity: 0.2,
    shininess: 0.9,
    polygonColor: "#fff",
    ambientLight: "#F8F9FE",
    directionalLeftLight: "#B89EFF",
    directionalTopLight: "#A25CFA",
    pointLight: "#A6FA45",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 0,
    maxRings: 3,
    initialPosition: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    autoRotate: false,
    autoRotateSpeed: 0.0,
  };
  const colors = ["#A6FA45", "#A25CFA"];
  // São Paulo como hub central fixo
  const saoPaulo = {
    lat: -23.5505,
    lng: -46.6333
  };

  // Destinos que se conectam a São Paulo
  const destinations = [
    {
      name: "Rio de Janeiro",
      lat: -22.9068,
      lng: -43.1729,
      order: 1,
      arcAlt: 0.1,
      color: colors[1] // Todas as outras cidades usam colors[1]
    },
    {
      name: "Brasília",
      lat: -15.7801,
      lng: -47.9292,
      order: 1,
      arcAlt: 0.2,
      color: colors[1]
    },
    {
      name: "Salvador",
      lat: -12.9714,
      lng: -38.5014,
      order: 2,
      arcAlt: 0.15,
      color: colors[1]
    },
    {
      name: "Fortaleza",
      lat: -3.7319,
      lng: -38.5267,
      order: 2,
      arcAlt: 0.25,
      color: colors[1]
    },
    {
      name: "Belo Horizonte",
      lat: -19.9167,
      lng: -43.9345,
      order: 2,
      arcAlt: 0.1,
      color: colors[1]
    },
    {
      name: "Manaus",
      lat: -3.1190,
      lng: -60.0217,
      order: 3,
      arcAlt: 0.3,
      color: colors[1]
    },
    {
      name: "Curitiba",
      lat: -25.4244,
      lng: -49.2654,
      order: 3,
      arcAlt: 0.1,
      color: colors[1]
    },
    {
      name: "Recife",
      lat: -8.0476,
      lng: -34.8770,
      order: 3,
      arcAlt: 0.2,
      color: colors[1]
    },
    {
      name: "Porto Alegre",
      lat: -30.0346,
      lng: -51.2177,
      order: 4,
      arcAlt: 0.15,
      color: colors[1]
    },
    {
      name: "Goiânia",
      lat: -16.6864,
      lng: -49.2643,
      order: 4,
      arcAlt: 0.1,
      color: colors[1]
    }
  ];

  // Gera arcos de todos os destinos para São Paulo
  const sampleArcs = destinations.map(dest => ({
    order: dest.order,
    startLat: dest.lat,
    startLng: dest.lng,
    endLat: saoPaulo.lat,
    endLng: saoPaulo.lng,
    arcAlt: dest.arcAlt,
    color: dest.color,
  }));

  // Adiciona São Paulo como ponto especial no início do array para garantir que apareça
  const sampleArcsWithSaoPaulo = [
    // São Paulo como ponto central (aparece primeiro)
    {
      order: 0,
      startLat: saoPaulo.lat,
      startLng: saoPaulo.lng,
      endLat: saoPaulo.lat,
      endLng: saoPaulo.lng,
      arcAlt: 0,
      color: colors[0], // Cor especial para São Paulo
    },
    ...sampleArcs
  ];
 
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
       

        
        </motion.div>
        <div className="absolute w-full h-72 md:h-full z-10">
          <World data={sampleArcsWithSaoPaulo} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
