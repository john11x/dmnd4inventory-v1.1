import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Handle POST requests for batch predictions
export async function POST(request) {
  try {
    const body = await request.json();
    const { features } = body;

    if (!features) {
      return NextResponse.json(
        { error: 'Missing required parameter: features' },
        { status: 400 }
      );
    }

    // Extract values from features dict
    const productId = features.sku_id?.replace('SKU_', '') || '1';
    const currentStock = features.current_stock || 50;
    const price = features.price || 100;
    
    // Use the same fallback logic as GET route
    const stock = parseFloat(currentStock);
    const priceVal = parseFloat(price);
    
    let predictedDemand;
    
    if (stock === 0) {
      // Out of stock = high demand
      predictedDemand = Math.ceil(50 * (1000 / Math.max(priceVal, 1)));
    } else if (stock < 10) {
      // Low stock = moderate demand
      predictedDemand = Math.ceil(20 * (1000 / Math.max(priceVal, 1)));
    } else if (stock > 200) {
      // High stock = lower demand
      predictedDemand = Math.ceil(5 * (1000 / Math.max(priceVal, 1)));
    } else {
      // Normal stock = baseline demand
      predictedDemand = Math.ceil(15 * (1000 / Math.max(priceVal, 1)));
    }
    
    return NextResponse.json({
      predictions: [predictedDemand],
      method: 'fallback',
      productId: parseInt(productId)
    });

  } catch (error) {
    console.error('Prediction API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Prediction service unavailable',
        predictions: [0]
      },
      { status: 500 }
    );
  }
}
