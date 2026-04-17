export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
};

export type CollectorLevel = {
  level: number;
  title: string;
  minOwned: number;
  nextLevelOwned: number | null;
  xp: number;
  xpForNext: number | null;
};

const LEVELS: Omit<CollectorLevel, "xp" | "xpForNext">[] = [
  { level: 1, title: "Novizio",       minOwned: 0,   nextLevelOwned: 10  },
  { level: 2, title: "Appassionato",  minOwned: 10,  nextLevelOwned: 25  },
  { level: 3, title: "Collezionista", minOwned: 25,  nextLevelOwned: 50  },
  { level: 4, title: "Archivista",    minOwned: 50,  nextLevelOwned: 100 },
  { level: 5, title: "Esperto",       minOwned: 100, nextLevelOwned: 200 },
  { level: 6, title: "Maestro",       minOwned: 200, nextLevelOwned: 500 },
  { level: 7, title: "Leggenda",      minOwned: 500, nextLevelOwned: null },
];

export function getCollectorLevel(totalOwned: number): CollectorLevel {
  const lvl = [...LEVELS].reverse().find((l) => totalOwned >= l.minOwned) ?? LEVELS[0];
  const xp = totalOwned - lvl.minOwned;
  const xpForNext = lvl.nextLevelOwned !== null ? lvl.nextLevelOwned - lvl.minOwned : null;
  return { ...lvl, xp, xpForNext };
}

type StatsInput = {
  totalOwned: number;
  totalSeries: number;
  totalMissing: number;
  totalWished: number;
};

export function computeBadges(stats: StatsInput): Badge[] {
  const { totalOwned, totalSeries, totalMissing, totalWished } = stats;

  return [
    {
      id: "first_item",
      name: "Primo Passo",
      description: "Aggiungi il tuo primo fumetto",
      icon: "📖",
      rarity: "common",
      earned: totalOwned >= 1,
    },
    {
      id: "ten_items",
      name: "Collezionista",
      description: "Possiedi 10 albi",
      icon: "📚",
      rarity: "common",
      earned: totalOwned >= 10,
    },
    {
      id: "fifty_items",
      name: "Archivista",
      description: "Possiedi 50 albi",
      icon: "🗄️",
      rarity: "rare",
      earned: totalOwned >= 50,
    },
    {
      id: "hundred_items",
      name: "Centurione",
      description: "Possiedi 100 albi",
      icon: "💯",
      rarity: "rare",
      earned: totalOwned >= 100,
    },
    {
      id: "five_hundred_items",
      name: "Maestro",
      description: "Possiedi 500 albi",
      icon: "🏆",
      rarity: "epic",
      earned: totalOwned >= 500,
    },
    {
      id: "first_series",
      name: "Esploratore",
      description: "Segui la tua prima serie",
      icon: "🔭",
      rarity: "common",
      earned: totalSeries >= 1,
    },
    {
      id: "five_series",
      name: "Buongustaio",
      description: "Segui 5 serie diverse",
      icon: "🎯",
      rarity: "common",
      earned: totalSeries >= 5,
    },
    {
      id: "ten_series",
      name: "Onnivoro",
      description: "Segui 10 serie diverse",
      icon: "🌍",
      rarity: "rare",
      earned: totalSeries >= 10,
    },
    {
      id: "wishlist",
      name: "Sognatore",
      description: "Aggiungi un albo alla wishlist",
      icon: "✨",
      rarity: "common",
      earned: totalWished >= 1,
    },
    {
      id: "hunter",
      name: "Cacciatore",
      description: "Tieni traccia di 5 albi mancanti",
      icon: "🕵️",
      rarity: "rare",
      earned: totalMissing >= 5,
    },
    {
      id: "legend",
      name: "Leggenda",
      description: "Possiedi 1000 albi",
      icon: "👑",
      rarity: "legendary",
      earned: totalOwned >= 1000,
    },
  ];
}
