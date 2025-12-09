import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const currentStock = searchParams.get('currentStock');
  const price = searchParams.get('price');

  return NextResponse.json({
    message: 'Test API working',
    demand: 42,
    stock: currentStock,
    price: price,
    method: 'test'
  });
}
