-- Takobon — Seed: Italian publishers and top series
-- Run in Supabase SQL Editor after 001_initial_schema.sql

-- ─────────────────────────────────────────────
-- PUBLISHERS
-- ─────────────────────────────────────────────

insert into publishers (name, country, slug) values
  ('Sergio Bonelli Editore', 'IT', 'bonelli'),
  ('Panini Comics', 'IT', 'panini'),
  ('Star Comics', 'IT', 'star-comics'),
  ('BAO Publishing', 'IT', 'bao'),
  ('Astorina', 'IT', 'astorina'),
  ('Max Bunker Press', 'IT', 'max-bunker')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────
-- SERIES
-- ─────────────────────────────────────────────

-- Bonelli
insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Dylan Dog', 'Dylan Dog', 'comic',
  (select id from publishers where slug = 'bonelli'),
  'L''indagatore dell''incubo. Nato nel 1986, Dylan Dog è il fumetto italiano più famoso al mondo.',
  'ongoing', array['horror', 'mystery', 'thriller'], 1986, 'dylan-dog', true
where not exists (select 1 from series where slug = 'dylan-dog');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Tex', 'Tex', 'comic',
  (select id from publishers where slug = 'bonelli'),
  'Il ranger texano. La serie a fumetti italiana più longeva, iniziata nel 1948.',
  'ongoing', array['western', 'adventure'], 1948, 'tex', true
where not exists (select 1 from series where slug = 'tex');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Martin Mystère', 'Martin Mystère', 'comic',
  (select id from publishers where slug = 'bonelli'),
  'Il detective dell''impossibile. Misteri, archeologia e avventura.',
  'ongoing', array['mystery', 'adventure', 'sci-fi'], 1982, 'martin-mystere', true
where not exists (select 1 from series where slug = 'martin-mystere');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Zagor', 'Zagor', 'comic',
  (select id from publishers where slug = 'bonelli'),
  'Lo Spirito con la Scure. Avventure nella foresta americana.',
  'ongoing', array['adventure', 'western'], 1961, 'zagor', true
where not exists (select 1 from series where slug = 'zagor');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Dampyr', 'Dampyr', 'comic',
  (select id from publishers where slug = 'bonelli'),
  'Figlio di un uomo e di un vampiro. Horror e avventura.',
  'ongoing', array['horror', 'fantasy', 'adventure'], 2000, 'dampyr', true
where not exists (select 1 from series where slug = 'dampyr');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Nathan Never', 'Nathan Never', 'comic',
  (select id from publishers where slug = 'bonelli'),
  'Un agente speciale nel futuro. Fantascienza e azione.',
  'ongoing', array['sci-fi', 'action'], 1991, 'nathan-never', true
where not exists (select 1 from series where slug = 'nathan-never');

-- Astorina
insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Diabolik', 'Diabolik', 'comic',
  (select id from publishers where slug = 'astorina'),
  'Il re del terrore. Il ladro e assassino più famoso d''Italia.',
  'ongoing', array['crime', 'thriller'], 1962, 'diabolik', true
where not exists (select 1 from series where slug = 'diabolik');

-- Max Bunker
insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Alan Ford', 'Alan Ford', 'comic',
  (select id from publishers where slug = 'max-bunker'),
  'Il gruppo TNT. Satira sociale e spionaggio.',
  'ongoing', array['comedy', 'spy', 'satire'], 1969, 'alan-ford', true
where not exists (select 1 from series where slug = 'alan-ford');

-- Star Comics (manga)
insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'One Piece', 'One Piece', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'La leggenda del Re dei Pirati. Il manga più venduto della storia.',
  'ongoing', array['adventure', 'action', 'fantasy'], 1997, 'one-piece', true
where not exists (select 1 from series where slug = 'one-piece');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Dragon Ball', 'Dragon Ball', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Le avventure di Son Goku. Il manga che ha rivoluzionato il genere shonen.',
  'completed', array['action', 'adventure', 'martial-arts'], 1984, 'dragon-ball', true
where not exists (select 1 from series where slug = 'dragon-ball');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Attack on Titan', 'L''Attacco dei Giganti', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Shingeki no Kyojin. L''umanità contro i giganti.',
  'completed', array['action', 'drama', 'dark-fantasy'], 2009, 'attack-on-titan', true
where not exists (select 1 from series where slug = 'attack-on-titan');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'My Hero Academia', 'My Hero Academia', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Boku no Hero Academia. Un mondo di supereroi.',
  'ongoing', array['action', 'school', 'super-powers'], 2014, 'my-hero-academia', true
where not exists (select 1 from series where slug = 'my-hero-academia');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Demon Slayer', 'Demon Slayer - Kimetsu no Yaiba', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Kimetsu no Yaiba. Un giovane cacciatore di demoni nell''era Taisho.',
  'completed', array['action', 'dark-fantasy', 'historical'], 2016, 'demon-slayer', true
where not exists (select 1 from series where slug = 'demon-slayer');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Naruto', 'Naruto', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Le avventure del giovane ninja Naruto Uzumaki.',
  'completed', array['action', 'adventure', 'ninja'], 1999, 'naruto', true
where not exists (select 1 from series where slug = 'naruto');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Jujutsu Kaisen', 'Jujutsu Kaisen', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Maledizioni e arti occulte nel Giappone moderno.',
  'ongoing', array['action', 'dark-fantasy', 'horror'], 2018, 'jujutsu-kaisen', true
where not exists (select 1 from series where slug = 'jujutsu-kaisen');

-- BAO Publishing
insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Saga', 'Saga', 'comic',
  (select id from publishers where slug = 'bao'),
  'L''epopea spaziale di Brian K. Vaughan e Fiona Staples.',
  'ongoing', array['sci-fi', 'fantasy', 'drama'], 2012, 'saga', true
where not exists (select 1 from series where slug = 'saga');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Fullmetal Alchemist', 'Fullmetal Alchemist', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Due fratelli alchimisti alla ricerca della pietra filosofale.',
  'completed', array['action', 'adventure', 'fantasy'], 2001, 'fullmetal-alchemist', true
where not exists (select 1 from series where slug = 'fullmetal-alchemist');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Chainsaw Man', 'Chainsaw Man', 'manga',
  (select id from publishers where slug = 'star-comics'),
  'Denji, il ragazzo motosega. Dark fantasy pieno di adrenalina.',
  'ongoing', array['action', 'dark-fantasy', 'horror'], 2018, 'chainsaw-man', true
where not exists (select 1 from series where slug = 'chainsaw-man');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Berserk', 'Berserk', 'manga',
  (select id from publishers where slug = 'panini'),
  'Il guerriero dei campi di battaglia. Il capolavoro dark fantasy di Kentaro Miura.',
  'ongoing', array['dark-fantasy', 'action', 'horror'], 1989, 'berserk', true
where not exists (select 1 from series where slug = 'berserk');

insert into series (title, title_it, type, publisher_id, description_it, status, genre, start_year, slug, is_verified)
select
  'Vinland Saga', 'Vinland Saga', 'manga',
  (select id from publishers where slug = 'panini'),
  'Vichinghi, guerra e redenzione. Un epico manga storico.',
  'ongoing', array['historical', 'action', 'drama'], 2005, 'vinland-saga', true
where not exists (select 1 from series where slug = 'vinland-saga');
