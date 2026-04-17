-- Takobon — Seed: placeholder covers + issues/volumes
-- Run in Supabase SQL Editor after 002_seed_italian_series.sql

-- ─────────────────────────────────────────────
-- PLACEHOLDER COVERS (replace with real URLs later)
-- Using picsum.photos with deterministic seeds per series
-- ─────────────────────────────────────────────

update series set cover_url = 'https://picsum.photos/seed/dylan-dog/200/300'     where slug = 'dylan-dog';
update series set cover_url = 'https://picsum.photos/seed/tex/200/300'           where slug = 'tex';
update series set cover_url = 'https://picsum.photos/seed/martin/200/300'        where slug = 'martin-mystere';
update series set cover_url = 'https://picsum.photos/seed/zagor/200/300'         where slug = 'zagor';
update series set cover_url = 'https://picsum.photos/seed/dampyr/200/300'        where slug = 'dampyr';
update series set cover_url = 'https://picsum.photos/seed/nathan/200/300'        where slug = 'nathan-never';
update series set cover_url = 'https://picsum.photos/seed/diabolik/200/300'      where slug = 'diabolik';
update series set cover_url = 'https://picsum.photos/seed/alanford/200/300'      where slug = 'alan-ford';
update series set cover_url = 'https://picsum.photos/seed/onepiece/200/300'      where slug = 'one-piece';
update series set cover_url = 'https://picsum.photos/seed/dragonball/200/300'    where slug = 'dragon-ball';
update series set cover_url = 'https://picsum.photos/seed/titan/200/300'         where slug = 'attack-on-titan';
update series set cover_url = 'https://picsum.photos/seed/mha/200/300'           where slug = 'my-hero-academia';
update series set cover_url = 'https://picsum.photos/seed/demonslayer/200/300'   where slug = 'demon-slayer';
update series set cover_url = 'https://picsum.photos/seed/naruto/200/300'        where slug = 'naruto';
update series set cover_url = 'https://picsum.photos/seed/jjk/200/300'           where slug = 'jujutsu-kaisen';
update series set cover_url = 'https://picsum.photos/seed/saga/200/300'          where slug = 'saga';
update series set cover_url = 'https://picsum.photos/seed/fma/200/300'           where slug = 'fullmetal-alchemist';
update series set cover_url = 'https://picsum.photos/seed/chainsaw/200/300'      where slug = 'chainsaw-man';
update series set cover_url = 'https://picsum.photos/seed/berserk/200/300'       where slug = 'berserk';
update series set cover_url = 'https://picsum.photos/seed/vinland/200/300'       where slug = 'vinland-saga';

-- ─────────────────────────────────────────────
-- ISSUES: Dylan Dog (first 15)
-- ─────────────────────────────────────────────

insert into issues (series_id, number, title, cover_price_eur, release_date_it, cover_url)
select s.id, n, t, 4.90, make_date(1986 + (n/12), ((n-1) % 12) + 1, 1),
  'https://picsum.photos/seed/dd' || n || '/200/300'
from series s,
  (values
    (1, 'L''alba dei morti viventi'),
    (2, 'Murderer'),
    (3, 'Il fantasma di Anna Never'),
    (4, 'Il club dei misteri'),
    (5, 'Attraverso lo specchio'),
    (6, 'Il lungo addio'),
    (7, 'La zona del crepuscolo'),
    (8, 'Il ritorno di Johnny Freak'),
    (9, 'Golems!'),
    (10, 'Il castello della paura'),
    (11, 'Il mostro di Londra'),
    (12, 'I vampiri'),
    (13, 'La storia di Maya'),
    (14, 'Il ritorno del mostro'),
    (15, 'Le notti del serial killer')
  ) as v(n, t)
where s.slug = 'dylan-dog'
on conflict (series_id, number) do nothing;

-- ─────────────────────────────────────────────
-- VOLUMES: One Piece (first 15)
-- ─────────────────────────────────────────────

insert into volumes (series_id, number, title, cover_price_eur, release_date_it, cover_url)
select s.id, n, t, 5.20, make_date(2001 + (n/12), ((n-1) % 12) + 1, 1),
  'https://picsum.photos/seed/op' || n || '/200/300'
from series s,
  (values
    (1, 'Romance Dawn'),
    (2, 'Versus!! Il guerriero Buggy'),
    (3, 'La verità che piange'),
    (4, 'Il giustiziere della luna'),
    (5, 'Per il vecchio pescecane'),
    (6, 'Il regno di Baratie'),
    (7, 'Il vecchio Zeff e lo chef della grande rotta'),
    (8, 'Io combatterò per te'),
    (9, 'Lanciato verso il baratro'),
    (10, 'Ok, lasciamola'),
    (11, 'La grande battaglia di Arlong Park'),
    (12, 'La pesca alle porte dell''oceano'),
    (13, 'Tik Tak'),
    (14, 'Instinct'),
    (15, 'Duel!')
  ) as v(n, t)
where s.slug = 'one-piece'
on conflict (series_id, number) do nothing;

-- ─────────────────────────────────────────────
-- VOLUMES: Dragon Ball (first 15)
-- ─────────────────────────────────────────────

insert into volumes (series_id, number, title, cover_price_eur, release_date_it, cover_url)
select s.id, n, t, 5.20, make_date(1988 + (n/12), ((n-1) % 12) + 1, 1),
  'https://picsum.photos/seed/db' || n || '/200/300'
from series s,
  (values
    (1, 'Il guerriero del drago'),
    (2, 'Il torneo'),
    (3, 'Il grande torneo del kung fu'),
    (4, 'L''avventura'),
    (5, 'Il Genio della Fortezza'),
    (6, 'Il cammino verso la fortezza'),
    (7, 'Il Diavolo di Muscle Tower'),
    (8, 'La Strega del Deserto'),
    (9, 'Il drago del deserto'),
    (10, 'L''avversario misterioso'),
    (11, 'Tenshinhan'),
    (12, 'Il grande finale'),
    (13, 'Piccolo Daimaō'),
    (14, 'Il ritorno di Goku'),
    (15, 'Scontro finale')
  ) as v(n, t)
where s.slug = 'dragon-ball'
on conflict (series_id, number) do nothing;

-- ─────────────────────────────────────────────
-- VOLUMES: Attack on Titan (first 10)
-- ─────────────────────────────────────────────

insert into volumes (series_id, number, title, cover_price_eur, release_date_it, cover_url)
select s.id, n, t, 6.50, make_date(2012 + (n/12), ((n-1) % 12) + 1, 1),
  'https://picsum.photos/seed/aot' || n || '/200/300'
from series s,
  (values
    (1, 'L''Attacco dei Giganti'),
    (2, 'Quel giorno'),
    (3, 'Una verità crudele'),
    (4, 'Combattimento a distanza ravvicinata'),
    (5, 'Gli urli dei morti'),
    (6, 'Il punto di non ritorno'),
    (7, '57ª spedizione oltre le mura'),
    (8, 'Strepito e fragore'),
    (9, 'La scelta dei reali'),
    (10, 'Cospiratori')
  ) as v(n, t)
where s.slug = 'attack-on-titan'
on conflict (series_id, number) do nothing;

-- ─────────────────────────────────────────────
-- VOLUMES: Berserk (first 10)
-- ─────────────────────────────────────────────

insert into volumes (series_id, number, title, cover_price_eur, release_date_it, cover_url)
select s.id, n, t, 7.50, make_date(1995 + (n/12), ((n-1) % 12) + 1, 1),
  'https://picsum.photos/seed/ber' || n || '/200/300'
from series s,
  (values
    (1, 'Il guerriero nero'),
    (2, 'La profezia'),
    (3, 'Il naso del cane'),
    (4, 'I nani della foresta'),
    (5, 'La campagna di Doldrey'),
    (6, 'Il torneo di Bakiraka'),
    (7, 'Il conte'),
    (8, 'Behelit'),
    (9, 'Prefazione al combattimento finale'),
    (10, 'L''eclissi')
  ) as v(n, t)
where s.slug = 'berserk'
on conflict (series_id, number) do nothing;
