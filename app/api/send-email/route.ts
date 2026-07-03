import InvoiceEmail from '@/app/dashboard/email/InvoiceEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const invoice = await req.json();
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'jedepen345@fivejm.com',
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