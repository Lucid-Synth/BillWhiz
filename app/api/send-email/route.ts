import InvoiceEmail from '@/app/dashboard/email/InvoiceEmail';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {

    const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.email) {
          return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
          );
        }

    const invoice = await req.json();
    const { data, error } = await resend.emails.send({
      from: 'BillWhiz <team@app.ujjwaldev.site>',
      to: session?.user.email,
      subject: 'Invoice Analysis',
      react: InvoiceEmail({ invoice: invoice}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
