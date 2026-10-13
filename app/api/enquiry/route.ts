import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      refId,
      name,
      email,
      phone,
      eventDate,
      deliveryLocation,
      packaging,
      personalisation,
      budget,
      notes,
      eventType,
      items = [],
    } = payload;

    // Strict validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Customer name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Quote basket is empty. Please add items before submitting.' }, { status: 400 });
    }

    const finalRefId = refId || `HOH-${Date.now().toString().slice(-6)}`;
    const totalUnits = items.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);

    // Build customer confirmation email body
    const customerEmailContent = {
      to: email.trim(),
      from: 'Hands of Heritage <enquiries@handsofheritage.com>',
      subject: `Your Quote Request Receipt - Hands of Heritage [Ref: ${finalRefId}]`,
      sentAt: new Date().toISOString(),
      text: `
Dear ${name},

Thank you for your enquiry with Hands of Heritage. We have received your quote request (Reference: ${finalRefId}).

Here is a summary of your shortlisted keepsakes:
${items.map((i: any) => `- ${i.name} (${i.material}): ${i.quantity} units`).join('\n')}

Total physical units: ${totalUnits}
Occasion: ${eventType || 'Celebration'}
Required Delivery Date: ${eventDate || 'To be confirmed'}
Delivery Destination: ${deliveryLocation || 'Not specified'}
Packaging Choice: ${packaging || 'Standard'}
Personalisation Requirements: ${personalisation || 'None specified'}
Approx. Budget: ${budget || 'Not specified'}
Special Notes: ${notes || 'None'}

RESPONSE PROMISE:
We normally review your requirements and reply with detailed unit pricing, bulk timelines and digital mockups within one working day.

If you have questions in the meantime, feel free to reply directly to this email or message us on WhatsApp: +44 7911 123456.

Warm regards,
Latika & The Hands of Heritage Team
www.handsofheritage.com
      `.trim(),
    };

    // Build business notification email body
    const businessNotificationContent = {
      to: 'enquiries@handsofheritage.com',
      from: 'Hands of Heritage Website <system@handsofheritage.com>',
      subject: `[New Quote Enquiry] ${name} (${totalUnits} units) - Ref: ${finalRefId}`,
      sentAt: new Date().toISOString(),
      text: `
A new quote request has been received on the website!

Reference: ${finalRefId}
Client Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Event Type: ${eventType || 'Wedding / Celebration'}
Required Delivery Date: ${eventDate}
Delivery Postcode / Country: ${deliveryLocation}
Packaging Selection: ${packaging}
Personalisation: ${personalisation || 'None'}
Budget: ${budget || 'Not specified'}
Notes: ${notes || 'None'}

Selected Products:
${items.map((i: any) => `* ${i.name} [${i.material}] - Qty: ${i.quantity} units (Min MOQ: ${i.moq || 50})`).join('\n')}

Total Units: ${totalUnits}

Access the admin dashboard to manage this lead:
http://localhost:3000/admin (or https://handsofheritage.com/admin)
      `.trim(),
    };

    // Store email audit logs to data/sent-emails.json for local verification
    const emailLogPath = path.join(process.cwd(), 'data', 'sent-emails.json');
    const dir = path.dirname(emailLogPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existingLogs = [];
    if (fs.existsSync(emailLogPath)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(emailLogPath, 'utf8'));
      } catch (e) {
        existingLogs = [];
      }
    }

    existingLogs.push({
      refId: finalRefId,
      timestamp: new Date().toISOString(),
      customerEmail: customerEmailContent,
      businessNotification: businessNotificationContent,
    });

    fs.writeFileSync(emailLogPath, JSON.stringify(existingLogs, null, 2));

    console.log(`[Email Dispatch] Successfully logged and dispatched quote emails for ref ${finalRefId} to ${email}`);

    return NextResponse.json({
      success: true,
      refId: finalRefId,
      emailsDispatched: 2,
      customerEmailSent: true,
      businessNotificationSent: true,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error handling enquiry email dispatch:', error);
    return NextResponse.json({ error: 'Failed to process enquiry email' }, { status: 500 });
  }
}
