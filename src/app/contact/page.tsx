import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & About",
  description: "Get in touch with Khanico Bites — our story, location and contact details.",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-extrabold text-charcoal">About Khanico Bites</h1>
      <p className="mt-4 max-w-2xl text-stone">
        Khanico Bites started as a single cart at Custom Chowk, Peshawar,
        serving smash burgers to late-night crowds. Today we've grown into a
        full kitchen serving burgers, pizza, fried chicken, wraps and sides —
        but we still cook every order fresh, the same way we did on day one.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-sharp border-2 border-charcoal/10 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-charcoal">Visit us</h2>
          <p className="mt-2 text-sm text-stone">Peshawar Custom Chowk, Peshawar, Pakistan</p>
          <p className="mt-1 text-sm text-stone">Open daily, 12:00 PM – 12:00 AM</p>
        </div>
        <div className="rounded-sharp border-2 border-charcoal/10 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-charcoal">Get in touch</h2>
          <p className="mt-2 text-sm text-stone">Phone: 0314-9478010</p>
          <p className="mt-1 text-sm text-stone">Email: asosment36@gmail.com</p>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 inline-flex !bg-basil hover:!bg-basil/90"
            >
              Message us on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
