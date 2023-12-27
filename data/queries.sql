-- vo2max

drop table vo2max;

create table
    vo2max as
select
    startdate as date,
    avg(value) as value
from
    read_csv_auto ('health/HKQuantityTypeIdentifierVO2Max.csv', dateformat = '%Y-%m-%d %H:%M:%S %z', header = true)
group by
    startdate
order by
    startdate;

select
    *
from
    vo2max;

copy vo2max to 'vo2max.parquet' (format parquet);

-- bodymass

drop table bodymass;

create table
    bodymass as
select
    startdate as date,
    avg(value) as value
from
    read_csv_auto ('health/HKQuantityTypeIdentifierBodyMass.csv', dateformat = '%Y-%m-%d %H:%M:%S %z', header = true)
where
    sourcename = 'Withings'
group by
    startdate
order by
    startdate;

select
    *
from
    bodymass;

copy bodymass to 'bodymass.parquet' (format parquet);

-- distance

drop table distance;

create table
    distance as
select
    strftime (startdate, '%Y-%m-01') as date,
    sum(value) as value
from
    read_csv_auto ('health/HKQuantityTypeIdentifierDistanceWalkingRunning.csv', dateformat = '%Y-%m-%d %H:%M:%S %z', header = true)
group by
    date
order by
    date;

select
    *
from
    distance;

copy distance to 'distance.parquet' (format parquet);