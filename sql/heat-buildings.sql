with complaints_all as (
	select distinct on (c.complaintid)
		c.bbl,
		c.apartment as apt,
		c.receiveddate as date
	from hpd_complaint_problems as p
	inner join hpd_complaints as c using(complaintid)
	where p.code ~* '(boiler)|(radiator)|(heat)' 
	  and p.code !~* 'summer'
	  and c.receiveddate between '2021-10-01' and '2023-05-31'
	  and borough = 'BROOKLYN'
	order by c.complaintid desc
), complaints_agg as (
	select 
		bbl, 
		count(*) filter (where date between '2021-10-01' and '2022-05-31') as complaints_last_season,
		count(*) filter (where date between '2022-10-01' and '2023-05-31') as complaints_this_season,
		array_to_json(array_agg(concat_ws('|', apt, date))) as complaint_details
	from complaints_all
	group by bbl
), all_data as (
	select 
		p.bbl, 
		initcap(p.address || ', Brooklyn') as address,
		p.unitsres as units,
		coalesce(r.uc2020, r.uc2019, r.uc2018) as rs_units,
		c.complaints_last_season,
		c.complaints_this_season,
		c.complaint_details,
		ST_SetSRID(ST_MakePoint(longitude, latitude),4326) as geom
	from complaints_agg as c
	left join pluto_latest as p using(bbl)
	left join rentstab_v2 as r ON c.bbl = r.ucbbl
	where p.latitude is not null
), features as (

  SELECT jsonb_build_object(
    'type',       'Feature',
    'id',         bbl,
    'geometry',   ST_AsGeoJSON(geom)::jsonb,
    'properties', to_jsonb(all_data) - 'geom'
  ) AS feature
  FROM all_data
)
SELECT jsonb_build_object(
    'type',     'FeatureCollection',
    'features', jsonb_agg(feature)
) as geojson
FROM features;