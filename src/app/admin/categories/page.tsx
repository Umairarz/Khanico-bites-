import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import CategoryManager from "@/components/CategoryManager";

export default async function AdminCategoriesPage() {
  const admin = getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-cream p-6 md:p-10">
        <h1 className="font-display text-2xl font-extrabold text-charcoal">Categories</h1>
        <CategoryManager
          initialCategories={categories.map((c) => ({ ...c, productCount: c._count.products }))}
        />
      </main>
    </div>
  );
}
