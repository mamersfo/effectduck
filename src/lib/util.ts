import * as arrow from 'apache-arrow'

export const arrowToJson = (data: arrow.Table<unknown>) => {
  return JSON.parse(
    JSON.stringify(data.toArray(), (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}
