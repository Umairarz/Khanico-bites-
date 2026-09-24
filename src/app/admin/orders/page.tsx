import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const admin = getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    where: searchParams.status ? { status: searchParams.status as any } : {},
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-cream p-6 md:p-10">
        <h1 className="font-display text-2xl font-extrabold text-charcoal">Orders</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/admin/orders"
            className={`rounded-sharp border-2 px-3 py-1.5 text-xs font-semibold ${
              !searchParams.status ? "border-chili bg-chili text-cream" : "border-charcoal/15 text-charcoal"
            }`}
          >
            All
          </a>
          {statuses.map((s) => (
            <a
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`rounded-sharp border-2 px-3 py-1.5 text-xs font-semibold ${
                searchParams.status === s ? "border-chili bg-chili text-cream" : "border-charcoal/15 text-charcoal"
              }`}
            >
              {s.replace(/_/g, " ")}
            </a>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-sharp border-2 border-charcoal/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-charcoal">{order.orderNumber}</p>
                  <p className="text-xs text-stone">
                    {order.customerName} · {order.customerPhone} · {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <OrderStatusSelect orderId={order.id} current={order.status} />
              </div>
              <p className="mt-2 text-sm text-stone">
                {order.deliveryLine1}, {order.deliveryCity}
              </p>
              {order.orderNotes && (
                <p className="mt-1 text-sm italic text-stone">Note: {order.orderNotes}</p>
              )}
              <ul className="mt-3 space-y-1 text-sm text-charcoal">
                {order.items.map((i) => (
                  <li key={i.id}>
                    {i.productName} × {i.quantity} — Rs {Number(i.lineTotal).toLocaleString()}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-display font-bold text-chili">
                Total: Rs {Number(order.total).toLocaleString()}
              </p>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="py-10 text-center text-stone">No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
