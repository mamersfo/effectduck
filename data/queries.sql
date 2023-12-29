-- vo2max

drop table vo2max;

create table vo2max as 
select 
    time_bucket ( interval '1 month', cast("startdate" as date)) as date, 
    avg(value) as value
from read_csv_auto(
    'data/health/HKQuantityTypeIdentifierVO2Max.csv'
)
group by date
order by date;

select * from vo2max;

copy vo2max to 'data/vo2max.parquet' (format parquet);

-- bodymass

drop table bodymass;

create table bodymass as 
select 
    time_bucket ( interval '1 day', cast("startdate" as date)) as date, 
    avg(value) as value
from read_csv_auto(
    'data/health/HKQuantityTypeIdentifierBodyMass.csv'
)
where sourcename = 'Withings'
group by date 
order by date;

select * from bodymass;

copy bodymass to 'data/bodymass.parquet' (format parquet);

--- distance

drop table distance;

create table distance as 
select 
    time_bucket ( interval '1 month', cast("startdate" as date)) as date, 
    sum(value) as value
from read_csv_auto(
    'data/health/HKQuantityTypeIdentifierDistanceWalkingRunning.csv'
)
group by date 
order by date;

copy distance to 'data/distance.parquet' (format parquet);