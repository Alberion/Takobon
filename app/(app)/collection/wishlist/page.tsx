import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wishlist — Takobon" };

export default function WishlistPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        Wishlist
      </h1>
      {/* TODO: WishlistList, EstimatedValue */}
    </div>
  );
}
