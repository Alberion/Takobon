import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} — Takobon` };
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      {/* TODO: SeriesHero (cover, title, metadata) */}
      {/* TODO: IssuesVolumesList for series: {slug} */}
    </div>
  );
}
