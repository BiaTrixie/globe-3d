import { useState, useEffect } from 'react';

export interface Marker {
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

export interface Connection {
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

export interface MarkersApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    markers: Marker[];
    statistics: {
      totalMarkers: number;
      totalConnections: number;
      regions: Record<string, number>;
      types: Record<string, number>;
    };
    metadata: {
      version: string;
      lastUpdated: string;
      source: string;
      description: string;
    };
  };
}

export interface UseMarkersApiReturn {
  markers: Marker[];
  arcs: Array<{
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
  }>;
  loading: boolean;
  error: string | null;
  statistics: MarkersApiResponse['data']['statistics'] | null;
  refetch: () => void;
}

export function useMarkersApi(): UseMarkersApiReturn {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [arcs, setArcs] = useState<Array<{
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<MarkersApiResponse['data']['statistics'] | null>(null);

  const fetchMarkers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simula uma chamada de API - em produção, substitua pela URL real
      const response = await fetch('/api/markers');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: MarkersApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao carregar marcadores');
      }
      
      setMarkers(data.data.markers);
      setStatistics(data.data.statistics);
      
      // Converte os marcadores e conexões para o formato de arcos do globo
      const arcsData = data.data.markers.flatMap(marker => 
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
      
      setArcs(arcsData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar marcadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  return {
    markers,
    arcs,
    loading,
    error,
    statistics,
    refetch: fetchMarkers,
  };
}

// Função para carregar dados do arquivo JSON local (para desenvolvimento)
export async function loadMarkersFromFile(): Promise<MarkersApiResponse> {
  try {
    const response = await fetch('/data/markers-api.json');
    if (!response.ok) {
      throw new Error(`Erro ao carregar arquivo: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar marcadores do arquivo:', error);
    throw error;
  }
}

// Hook alternativo para usar dados do arquivo local
export function useMarkersFromFile(): UseMarkersApiReturn {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [arcs, setArcs] = useState<Array<{
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<MarkersApiResponse['data']['statistics'] | null>(null);

  const fetchMarkers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loadMarkersFromFile();
      
      setMarkers(data.data.markers);
      setStatistics(data.data.statistics);
      
      // Converte os marcadores e conexões para o formato de arcos do globo
      const arcsData = data.data.markers.flatMap(marker => 
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
      
      setArcs(arcsData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar marcadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  return {
    markers,
    arcs,
    loading,
    error,
    statistics,
    refetch: fetchMarkers,
  };
}
