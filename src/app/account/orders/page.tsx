import { prisma } from "@/lib/db";
import { getCustomerFromCookies } from "@/lib/auth";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  PENDING: "bg-turmeric/20 text-turmeric",
  CONFIRMED: "bg-basil/15 text-basil",
  PREPARING: "bg-basil/15 text-basil",
  OUT_FOR_DELIVERY: "bg-chili/15 text-chili",
  DELIVERED: "bg-basil/20 text-basil",
  CANCELLED: "bg-stone/20 text-stone",
};

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default async function OrderHistoryPage({
  searchParams,
}: {
  searchParams: { placed?: string };
}) {
  const session = getCustomerFromCookies();
  const orders = session
    ? await prisma.order.findMany({
        where: { userId: session.sub },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold text-charcoal">Your Orders</h1>

      {searchParams.placed && (
        <div className="mt-4 rounded-sharp border-2 border-basil bg-basil/10 px-4 py-3 text-sm text-basil">
          Order <strong>{searchParams.placed}</strong> placed successfully! We'll start preparing it shortly.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-stone">You haven't placed any orders yet.</p>
          <Link href="/menu" className="btn-primary mt-6 inline-flex">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-sharp border-2 border-charcoal/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-charcoal">{order.orderNumber}</p>
                  <p className="text-xs text-stone">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-sharp px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-stone">
                {order.items.map((i) => (
                  <li key={i.id}>
                    {i.productName} × {i.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-display font-bold text-chili">
                Total: Rs {Number(order.total).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
