import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'quotes.json');

// Helper to read quotes
function readQuotes() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading quotes file:', error);
    return [];
  }
}

// Helper to write quotes
function writeQuotes(quotes: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(quotes, null, 2));
}

type Params = {
  id: string;
};

export async function PATCH(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    
    const quotes = readQuotes();
    const index = quotes.findIndex((q: any) => q.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    quotes[index].status = status;
    writeQuotes(quotes);
    
    return NextResponse.json({ success: true, quote: quotes[index] });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const quotes = readQuotes();
    const filteredQuotes = quotes.filter((q: any) => q.id !== id);
    
    if (quotes.length === filteredQuotes.length) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    writeQuotes(filteredQuotes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
