export type Quantifier = {
  table: string
  unit: string
  value: string
  aggregate?: string
  color?: string
}

export const quantifiers: Quantifier[] = [
  {
    table: 'VO2Max',
    unit: 'mL/min·kg',
    value: 'max',
    aggregate: 'max',
    color: 'hsl(341, 70%, 50%)',
  },
  {
    table: 'BodyMass',
    unit: 'kg',
    value: 'avg',
    aggregate: 'avg',
  },
  {
    table: 'DistanceWalkingRunning',
    unit: 'km',
    value: 'sum',
    aggregate: 'sum',
  },
  {
    table: 'RunningSpeed',
    unit: 'km/hr',
    value: 'avg',
    aggregate: 'avg',
  },
  {
    table: 'RestingHeartRate',
    unit: 'count/min',
    value: 'avg',
    aggregate: 'avg',
  },
  {
    table: 'AppleStandTime',
    unit: 'min',
    value: 'sum',
    aggregate: 'avg',
  },
]
