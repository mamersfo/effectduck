#!/bin/bash

# skipped:
# HKCategoryTypeIdentifierAppleStandHour
# HKCategoryTypeIdentifierAudioExposureEvent
# HKCategoryTypeIdentifierSleepAnalysis

declare -a identifiers=(
    "ActiveEnergyBurned" 
    "AppleExerciseTime"
    "AppleStandTime"
    "AppleWalkingSteadiness"
    "BasalEnergyBurned"
    "BodyFatPercentage"
    "BodyMass"
    "BodyMassIndex"
    "DistanceWalkingRunning"
    "EnvironmentalAudioExposure"
    "EnvironmentalSoundReduction"
    "FlightsClimbed"
    "HeadphoneAudioExposure"
    "HeartRate"
    "HeartRateRecoveryOneMinute"
    "HeartRateVariabilitySDNN"
    "Height"
    "OxygenSaturation"
    "PhysicalEffort"
    "RestingHeartRate"
    "RunningGroundContactTime"
    "RunningPower"
    "RunningSpeed"
    "RunningStrideLength"
    "RunningVerticalOscillation"
    "SixMinuteWalkTestDistance"
    "StairAscentSpeed"
    "StairDescentSpeed"
    "StepCount"
    "TimeInDaylight"
    "VO2Max"
    "WalkingAsymmetryPercentage"
    "WalkingDoubleSupportPercentage"
    "WalkingHeartRateAverage"
    "WalkingSpeed"
    "WalkingStepLength"
)

# skipped:
# HKCategoryTypeIdentifierAppleStandHour
# HKCategoryTypeIdentifierAudioExposureEvent
# HKCategoryTypeIdentifierSleepAnalysis

cmd="
COPY (
    SELECT 
        cast ( time_bucket ( interval '1 day', startDate) as date) as date, 
        count(value) as count,
        sum(value) as sum,
        min(value) as min,
        max(value) as max,
        avg(value) as avg
    FROM read_csv(
        '/dev/stdin',
        delim='|',
        header=false, 
        columns={ sourceName: 'VARCHAR', startDate: 'TIMESTAMPTZ', value: 'FLOAT', unit: 'VARCHAR' }
    )
    WHERE sourceName IN ( 'Martin’s Apple Watch', 'Withings' )
    GROUP BY date
    ORDER BY date
) 
TO '/dev/stdout' 
WITH (FORMAT PARQUET)"

mkdir -p data/csv
mkdir -p data/parquet


for i in "${identifiers[@]}"; do
    xpath="/HealthData/Record[@type='HKQuantityTypeIdentifier${i}']"
    echo "Processing ${xpath}..."
    xmlstarlet select --template \
        --match $xpath \
        --value-of 'concat(@sourceName, "|", @startDate, "|", @value, "|", @unit)' \
        --nl apple_health_export/export.xml > "data/csv/${i}.csv"
    cat "data/csv/${i}.csv" | duckdb -c "${cmd}" > "data/parquet/${i}.parquet"
done
