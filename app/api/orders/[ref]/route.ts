import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'orders.json');

// Handle GET request to fetch the status of the order by reference
export async function GET(request: Request, { params }: { params: { ref: string } }) {
  const { ref } = params;

  if (fs.existsSync(ordersFile)) {
    try {
      const fileData = fs.readFileSync(ordersFile, 'utf-8'); // ✅ read as string
      const orders = JSON.parse(fileData);
      const order = orders.find((o: any) => o.reference === ref);

      if (order) {
        return NextResponse.json({ status: order.status });
      } else {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
    } catch (err) {
      console.error('Error reading or parsing orders.json:', err);
      return NextResponse.json({ message: 'Error processing orders file' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'No orders file found' }, { status: 404 });
  }
}

// Handle PATCH request to update the status of an order
export async function PATCH(request: Request, { params }: { params: { ref: string } }) {
    const { ref } = params;
    const { status } = await request.json();  // Get the new status from the request body
  
    // Check if the orders file exists
    if (fs.existsSync(ordersFile)) {
      try {
        // Read the orders file and parse the data
        const fileData = fs.readFileSync(ordersFile, 'utf-8');
        const orders = JSON.parse(fileData);
  
        // Find the order by reference
        const orderIndex = orders.findIndex((order: any) => order.reference === ref);
  
        if (orderIndex !== -1) {
          // Update the order status
          orders[orderIndex].status = status;
  
          // Save the updated orders list back to the file
          fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8');
  
          // Return a successful response
          return NextResponse.json({ message: 'Order status updated' });
        } else {
          // Return a 404 if the order is not found
          return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
      } catch (err) {
        console.error('Error reading or writing to orders.json:', err);
        return NextResponse.json({ message: 'Error processing orders file' }, { status: 500 });
      }
    } else {
      // Return a 404 if the orders file is not found
      return NextResponse.json({ message: 'No orders file found' }, { status: 404 });
    }
  }
