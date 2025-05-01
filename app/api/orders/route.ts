import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'orders.json');

// POST request handler to save a new order
export async function POST(request: Request) {
  const order = await request.json();

  try {
    let orders = [];

    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, 'utf-8'); // ✅ read as string
      orders = JSON.parse(fileData);
    }

    orders.push(order);

    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8'); // ✅ write as string

    return NextResponse.json({ message: 'Order saved', order });
  } catch (err) {
    console.error('Error saving order:', err);
    return NextResponse.json({ message: 'Error saving order' }, { status: 500 });
  }
}

// GET request handler to fetch all orders
export async function GET() {
  try {
    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, 'utf-8'); // ✅ read as string
      const orders = JSON.parse(fileData);
      return NextResponse.json(orders);
    } else {
      return NextResponse.json([], { status: 404 });
    }
  } catch (err) {
    console.error('Error reading orders:', err);
    return NextResponse.json({ message: 'Error reading orders' }, { status: 500 });
  }
}
