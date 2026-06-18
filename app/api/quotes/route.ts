import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'quotes.json');

// Helper to read quotes
function readQuotes() {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
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
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(quotes, null, 2));
}

export async function GET() {
  try {
    const quotes = readQuotes();
    // Return newest quotes first
    const sortedQuotes = [...quotes].reverse();
    return NextResponse.json(sortedQuotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quotes = readQuotes();
    
    const newQuote = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'New', // Default status
      ...body,
    };
    
    quotes.push(newQuote);
    writeQuotes(quotes);
    
    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error) {
    console.error('Error adding quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
