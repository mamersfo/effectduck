-- vo2max

drop table vo2max;

create table vo2max as 
select 
    cast ( time_bucket ( interval '1 month', startDate ) as date) as date, 
    avg(value) as value
from read_csv(
    'apple_health_export/HKQuantityTypeIdentifierVO2Max.csv',
    delim=";",
    header=false,
    columns={
        startDate: 'TIMESTAMPTZ',
        value: 'FLOAT'
    }
)
group by date
order by date;

select * from vo2max;

copy vo2max to 'data/vo2max.parquet' (format parquet);

-- bodymass

drop table bodymass;

create table bodymass as 
select 
    cast ( time_bucket ( interval '1 day', startDate) as date) as date, 
    avg(value) as value
from read_csv(
    'data/csv/HKQuantityTypeIdentifierBodyMass.csv',
    delim=";",
    header=false,
    columns={
        sourceName: 'VARCHAR',
        startDate: 'TIMESTAMPTZ',
        value: 'FLOAT'
    }
)
group by date 
order by date;

copy bodymass to 'data/bodymass.parquet' (format parquet);

--- distance

drop table distance;

create table distance as 
select 
    cast ( time_bucket ( interval '1 month', startDate) as date) as date, 
    sum(value) as value
from read_csv(
    'apple_health_export/HKQuantityTypeIdentifierDistanceWalkingRunning.csv',
    delim=";",
    header=false,
    columns={
        sourceName: 'VARCHAR',
        startDate: 'TIMESTAMPTZ',
        value: 'FLOAT'
    }
)
group by date 
order by date;

copy distance to 'data/distance.parquet' (format parquet);



copy ( select 
sourceName as source, 
cast ( time_bucket ( interval '1 day', startDate) as date) as date, 
avg(value) as value 
from read_csv( 
    'data/csv/WalkingStepLength.csv', delim='|', header=false, 
    columns={ sourceName: 'VARCHAR', startDate: 'TIMESTAMPTZ', value: 'FLOAT' }) 
group by source, date 
order by date ) to 'data/parquet/WalkingStepLength.parquet' (format parquet);