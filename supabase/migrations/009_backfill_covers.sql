-- Back-fill cover_url on volumes/issues that are NULL, using the parent series cover
update volumes v
set cover_url = s.cover_url
from series s
where v.series_id = s.id
  and v.cover_url is null
  and s.cover_url is not null;

update issues i
set cover_url = s.cover_url
from series s
where i.series_id = s.id
  and i.cover_url is null
  and s.cover_url is not null;
