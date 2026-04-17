-- Takobon — Update series covers with real Wikipedia Commons images
-- Run in Supabase SQL Editor

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_volume_1_cover_%28Japanese%29.jpg'
where slug = 'one-piece';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/a/a7/Dragon_Ball_Vol_1_tankobon_cover.jpg'
where slug = 'dragon-ball';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg'
where slug = 'naruto';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_vol_1.jpg'
where slug = 'attack-on-titan';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/8/8e/Berserk_Volume_1.jpg'
where slug = 'berserk';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/4/44/Death_Note_volume_1.jpg'
where slug = 'death-note';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/4/4d/DylanDog1.jpg'
where slug = 'dylan-dog';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/it/thumb/1/15/Tex_willer_01.jpg/250px-Tex_willer_01.jpg'
where slug = 'tex';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/3/3e/Diabolik_-_il_re_del_terrore.jpg'
where slug = 'diabolik';

update series set cover_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/FullmetalAlchemistVol1.jpg/250px-FullmetalAlchemistVol1.jpg'
where slug = 'fullmetal-alchemist';
