import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; type: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, type, id } = await params;
  return { title: `${slug} — ${type} #${id} — Takobon` };
}

export default async function ItemPage({ params }: Props) {
  const { slug, type, id } = await params;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* TODO: ItemDetail for {type} #{id} of series {slug} */}
      {/* TODO: StatusSelector (owned / wished / missing) */}
      {/* TODO: PriceField */}
    </div>
  );
}
