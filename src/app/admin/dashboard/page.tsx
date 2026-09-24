import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminDashboardPage() {
  const admin = getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  const [totalOrders, pendingOrders, deliveredOrders, allOrders, productCount, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, orderNumber: true, customerName: true, status: true, total: true, createdAt: true },
      }),
    ]);

  const totalSales = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const cards = [
    { label: "Total Orders", value: totalOrders },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Delivered Orders", value: deliveredOrders },
    { label: "Total Sales", value: `Rs ${totalSales.toLocaleString()}` },
    { label: "Menu Items", value: productCount },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-cream p-6 md:p-10">
        <h1 className="font-display text-2xl font-extrabold text-charcoal">Dashboard</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="rounded-sharp border-2 border-charcoal/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone">{c.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-charcoal">{c.value}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display text-lg font-bold text-charcoal">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto rounded-sharp border-2 border-charcoal/10 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-charcoal/5 text-xs font-semibold uppercase text-stone">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-charcoal/5">
                  <td className="px-4 py-3 font-semibold text-charcoal">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-stone">{o.customerName}</td>
                  <td className="px-4 py-3 text-stone">{o.status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-stone">Rs {Number(o.total).toLocaleString()}</td>
                  <td className="px-4 py-3 text-stone">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-stone">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
