# API de Marcadores do Globo 3D

Esta documentação descreve como usar a API de marcadores para o globo 3D.

## Estrutura dos Dados

### Resposta da API

```json
{
  "success": true,
  "message": "Marcadores do globo carregados com sucesso",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "markers": [...],
    "statistics": {...},
    "metadata": {...}
  }
}
```

### Estrutura de um Marcador

```typescript
interface Marker {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  connections: Connection[];
  type: 'capital' | 'city' | 'city-state' | 'other';
  population: number;
  region: string;
}
```

### Estrutura de uma Conexão

```typescript
interface Connection {
  id: string;
  target: string;
  targetCoordinates: {
    lat: number;
    lng: number;
  };
  arcAlt: number;
  color: string;
  order: number;
  description: string;
}
```

## Endpoints da API

### GET /api/markers

Retorna todos os marcadores com suas conexões.

**Parâmetros de Query:**
- `region` (opcional): Filtra por região (ex: "América do Sul", "Europa")
- `type` (opcional): Filtra por tipo (ex: "capital", "city")
- `limit` (opcional): Limita o número de resultados

**Exemplos:**
```bash
# Todos os marcadores
GET /api/markers

# Apenas capitais
GET /api/markers?type=capital

# Apenas da América do Sul
GET /api/markers?region=América do Sul

# Limite de 10 marcadores
GET /api/markers?limit=10

# Capitais da Europa, máximo 5
GET /api/markers?type=capital&region=Europa&limit=5
```

### POST /api/markers

Adiciona um novo marcador (implementação futura).

## Como Usar no Código

### 1. Hook Personalizado

```typescript
import { useMarkersFromFile } from '@/hooks/use-markers-api';

function MeuComponente() {
  const { markers, arcs, loading, error, statistics } = useMarkersFromFile();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <World data={arcs} globeConfig={globeConfig} />
  );
}
```

### 2. Carregamento Manual

```typescript
import { loadMarkersFromFile } from '@/hooks/use-markers-api';

async function carregarMarcadores() {
  try {
    const response = await loadMarkersFromFile();
    const markers = response.data.markers;
    const arcs = markers.flatMap(marker => 
      marker.connections.map(connection => ({
        order: connection.order,
        startLat: marker.coordinates.lat,
        startLng: marker.coordinates.lng,
        endLat: connection.targetCoordinates.lat,
        endLng: connection.targetCoordinates.lng,
        arcAlt: connection.arcAlt,
        color: connection.color,
      }))
    );
    
    return { markers, arcs };
  } catch (error) {
    console.error('Erro ao carregar marcadores:', error);
  }
}
```

### 3. Usando Fetch Direto

```typescript
async function buscarMarcadores() {
  try {
    const response = await fetch('/api/markers?type=capital&limit=10');
    const data = await response.json();
    
    if (data.success) {
      return data.data.markers;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro na API:', error);
  }
}
```

## Exemplo Completo

```typescript
"use client";
import React from "react";
import { useMarkersFromFile } from "@/hooks/use-markers-api";
import World from "@/components/ui/globe";

export default function GlobeComAPI() {
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

  if (loading) return <div>Carregando marcadores...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="h-screen w-full">
      <World data={arcs} globeConfig={globeConfig} />
      
      {/* Painel de estatísticas */}
      {statistics && (
        <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded">
          <h3>Estatísticas</h3>
          <p>Marcadores: {statistics.totalMarkers}</p>
          <p>Conexões: {statistics.totalConnections}</p>
        </div>
      )}
    </div>
  );
}
```

## Dados Incluídos

A API inclui 30 marcadores de cidades e capitais ao redor do mundo, com:

- **30 marcadores** distribuídos globalmente
- **45 conexões** entre os marcadores
- **9 regiões** diferentes (América do Sul, Europa, Ásia, etc.)
- **4 tipos** de marcadores (capital, city, city-state, other)

### Regiões Incluídas:
- América do Sul (4 marcadores)
- América do Norte (4 marcadores)
- Europa (5 marcadores)
- Ásia (8 marcadores)
- África (4 marcadores)
- Oceania (1 marcador)
- Pacífico (1 marcador)
- Oriente Médio (1 marcador)
- Sudeste Asiático (2 marcadores)

## Personalização

Você pode facilmente personalizar os dados editando o arquivo `data/markers-api.json` ou implementando um backend real que retorne dados no mesmo formato.

Para adicionar novos marcadores, siga a estrutura definida nas interfaces TypeScript acima.
