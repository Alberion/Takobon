-- Takobon — Add J-POP publisher and expand series catalog
-- Run in Supabase SQL Editor

-- ─────────────────────────────────────────────
-- PUBLISHERS
-- ─────────────────────────────────────────────

insert into publishers (name, country, slug) values
  ('J-POP', 'IT', 'jpop'),
  ('Edizioni Star Comics', 'IT', 'star-comics-ed')
on conflict (slug) do nothing;

-- Fix existing Star Comics slug reference (already seeded as 'star-comics')
-- Panini Comics already seeded

-- ─────────────────────────────────────────────
-- J-POP SERIES
-- ─────────────────────────────────────────────

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Vinland Saga', 'Vinland Saga', 'manga',
  (select id from publishers where slug = 'jpop'),
  'Il viaggio epico di Thorfinn attraverso l''Europa vichinga. Un capolavoro di avventura e crescita.',
  'completed', array['action', 'adventure', 'historical'], 2005, 'vinland-saga',
  'https://cdn.myanimelist.net/images/manga/2/188925l.jpg', true
where not exists (select 1 from series where slug = 'vinland-saga');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Koe no Katachi', 'A Silent Voice', 'manga',
  (select id from publishers where slug = 'jpop'),
  'Una storia toccante su bullismo, redenzione e amicizia. Adattato in un film d''animazione di successo.',
  'completed', array['drama', 'slice_of_life', 'romance'], 2013, 'a-silent-voice',
  'https://cdn.myanimelist.net/images/manga/1/120529l.jpg', true
where not exists (select 1 from series where slug = 'a-silent-voice');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Dungeon Meshi', 'Delicious in Dungeon', 'manga',
  (select id from publishers where slug = 'jpop'),
  'Avventurieri esplorano un dungeon cucinando i mostri che incontrano. Fantasy e gastronomia.',
  'completed', array['adventure', 'fantasy', 'comedy'], 2014, 'dungeon-meshi',
  'https://cdn.myanimelist.net/images/manga/3/148949l.jpg', true
where not exists (select 1 from series where slug = 'dungeon-meshi');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Made in Abyss', 'Made in Abyss', 'manga',
  (select id from publishers where slug = 'jpop'),
  'Una bambina scende in un abisso misterioso alla ricerca di sua madre. Dark fantasy di straordinaria intensità.',
  'ongoing', array['adventure', 'fantasy', 'mystery'], 2012, 'made-in-abyss',
  'https://cdn.myanimelist.net/images/manga/3/161645l.jpg', true
where not exists (select 1 from series where slug = 'made-in-abyss');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Oyasumi Punpun', 'Goodnight Punpun', 'manga',
  (select id from publishers where slug = 'jpop'),
  'La storia di crescita di Punpun, un ragazzo rappresentato come un uccellino stilizzato. Opera psicologica intensa.',
  'completed', array['drama', 'psychological', 'slice_of_life'], 2007, 'goodnight-punpun',
  'https://cdn.myanimelist.net/images/manga/3/266834l.jpg', true
where not exists (select 1 from series where slug = 'goodnight-punpun');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Blue Period', 'Blue Period', 'manga',
  (select id from publishers where slug = 'jpop'),
  'Un liceale scopre la pittura e si prepara all''esame per la più prestigiosa scuola d''arte del Giappone.',
  'ongoing', array['drama', 'slice_of_life'], 2017, 'blue-period',
  'https://cdn.myanimelist.net/images/manga/2/204827l.jpg', true
where not exists (select 1 from series where slug = 'blue-period');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Akira', 'Akira', 'manga',
  (select id from publishers where slug = 'jpop'),
  'Il capolavoro di Katsuhiro Otomo. Tokyo post-apocalittica, bande di motociclisti e poteri psichici.',
  'completed', array['sci-fi', 'action', 'psychological'], 1982, 'akira',
  'https://cdn.myanimelist.net/images/manga/5/252072l.jpg', true
where not exists (select 1 from series where slug = 'akira');

-- ─────────────────────────────────────────────
-- PANINI COMICS SERIES
-- ─────────────────────────────────────────────

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Hunter x Hunter', 'Hunter x Hunter', 'manga',
  (select id from publishers where slug = 'panini'),
  'Gon parte alla ricerca del padre, un leggendario Hunter. Uno dei manga shonen più amati di sempre.',
  'ongoing', array['action', 'adventure', 'fantasy'], 1998, 'hunter-x-hunter',
  'https://cdn.myanimelist.net/images/manga/2/253119l.jpg', true
where not exists (select 1 from series where slug = 'hunter-x-hunter');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Spy x Family', 'Spy x Family', 'manga',
  (select id from publishers where slug = 'panini'),
  'Una spia, un''assassina e una bambina telepatica formano una famiglia finta. Commedia e azione.',
  'ongoing', array['action', 'comedy', 'slice_of_life'], 2019, 'spy-x-family',
  'https://cdn.myanimelist.net/images/manga/3/219741l.jpg', true
where not exists (select 1 from series where slug = 'spy-x-family');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Chainsaw Man', 'Chainsaw Man', 'manga',
  (select id from publishers where slug = 'panini'),
  'Denji, un ragazzo fuso con un diavolo motosega, combatte demoni per conto del governo.',
  'ongoing', array['action', 'horror', 'dark_fantasy'], 2018, 'chainsaw-man',
  'https://cdn.myanimelist.net/images/manga/3/216464l.jpg', true
where not exists (select 1 from series where slug = 'chainsaw-man');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Jujutsu Kaisen', 'Jujutsu Kaisen', 'manga',
  (select id from publishers where slug = 'panini'),
  'Yuji Itadori inghiotte un dito maledetto e viene coinvolto nel mondo degli stregoni e delle maledizioni.',
  'ongoing', array['action', 'supernatural', 'dark_fantasy'], 2018, 'jujutsu-kaisen',
  'https://cdn.myanimelist.net/images/manga/3/210341l.jpg', true
where not exists (select 1 from series where slug = 'jujutsu-kaisen');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, cover_url, is_verified)
select 'Kimetsu no Yaiba', 'Demon Slayer', 'manga',
  (select id from publishers where slug = 'panini'),
  'Tanjiro diventa un cacciatore di demoni per salvare sua sorella trasformata in demone. Fenomeno mondiale.',
  'completed', array['action', 'supernatural', 'historical'], 2016, 'demon-slayer',
  'https://cdn.myanimelist.net/images/manga/3/179023l.jpg', true
where not exists (select 1 from series where slug = 'demon-slayer');
