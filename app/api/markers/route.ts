import { NextRequest, NextResponse } from 'next/server';
import markersData from '@/data/markers-api.json';

export async function GET(request: NextRequest) {
  try {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Parâmetros de query opcionais
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    let filteredMarkers = markersData.data.markers;

    // Filtros opcionais
    if (region) {
      filteredMarkers = filteredMarkers.filter(marker => 
        marker.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (type) {
      filteredMarkers = filteredMarkers.filter(marker => 
        marker.type === type
      );
    }

    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredMarkers = filteredMarkers.slice(0, limitNum);
      }
    }

    // Recalcula estatísticas baseadas nos dados filtrados
    const regions = filteredMarkers.reduce((acc, marker) => {
      acc[marker.region] = (acc[marker.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const types = filteredMarkers.reduce((acc, marker) => {
      acc[marker.type] = (acc[marker.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalConnections = filteredMarkers.reduce((acc, marker) => 
      acc + marker.connections.length, 0
    );

    const response = {
      ...markersData,
      data: {
        ...markersData.data,
        markers: filteredMarkers,
        statistics: {
          totalMarkers: filteredMarkers.length,
          totalConnections,
          regions,
          types,
        }
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro na API de marcadores:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Aqui você pode implementar lógica para adicionar novos marcadores
    // Por exemplo, salvar em um banco de dados
    
    return NextResponse.json({
      success: true,
      message: 'Marcador adicionado com sucesso',
      timestamp: new Date().toISOString(),
      data: {
        id: Date.now().toString(),
        ...body,
      }
    });
  } catch (error) {
    console.error('Erro ao adicionar marcador:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar requisição',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
