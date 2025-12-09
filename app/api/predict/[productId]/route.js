import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { productId } = params;
  const { searchParams } = new URL(request.url);
  
  const currentStock = searchParams.get('currentStock');
  const price = searchParams.get('price');

  if (!currentStock || !price) {
    return NextResponse.json(
      { error: 'Missing required parameters: currentStock and price' },
      { status: 400 }
    );
  }

  // Clean fallback calculation based on business logic
  const stock = parseFloat(currentStock);
  const priceVal = parseFloat(price);
  
  let predictedDemand;
  
  if (stock === 0) {
    // Out of stock = high demand (people want it but can't get it)
    predictedDemand = Math.ceil(50 * (1000 / Math.max(priceVal, 1)));
  } else if (stock < 10) {
    // Low stock = moderate demand
    predictedDemand = Math.ceil(20 * (1000 / Math.max(priceVal, 1)));
  } else if (stock > 200) {
    // High stock = lower demand (slow mover)
    predictedDemand = Math.ceil(5 * (1000 / Math.max(priceVal, 1)));
  } else {
    // Normal stock = baseline demand
    predictedDemand = Math.ceil(15 * (1000 / Math.max(priceVal, 1)));
  }
  
  return NextResponse.json({
    demand: predictedDemand,
    productId: parseInt(productId),
    method: 'fallback',
    stockLevel: stock,
    price: priceVal
  });
}