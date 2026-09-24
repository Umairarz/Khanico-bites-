import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import ProductManager from "@/components/ProductManager";

export default async function AdminProductsPage() {
  const admin = getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-cream p-6 md:p-10">
        <h1 className="font-display text-2xl font-extrabold text-charcoal">Products</h1>
        <ProductManager
          initialProducts={products.map((p) => ({ ...p, price: Number(p.price) }))}
          categories={categories}
        />
      </main>
    </div>
  );
}
