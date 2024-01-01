import * as arrow from 'apache-arrow'
import * as duckdb from '@duckdb/duckdb-wasm'
import { parseISO } from 'date-fns'
import { type Quantifier, quantifiers } from '../types'

export const arrowToJson = (data: arrow.Table<unknown>) => {
  return JSON.parse(
    JSON.stringify(data.toArray(), (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

export const load = async (db: duckdb.AsyncDuckDB, q: Quantifier) => {
  const conn = await db.connect()

  const path = `data/parquet/${q.table}.parquet`
  let res = await fetch(path)

  await db.registerFileBuffer(
    `buffer.${q.table}.parquet`,
    new Uint8Array(await res.arrayBuffer())
  )

  await conn.query(`
    create table ${q.table} as 
    select 
      date as d, 
      ${q.value} as v
    from 'buffer.${q.table}.parquet'
    where date >= '2022-01-01'
    and date < '2024-01-01'
  `)

  conn.close()
}

export const readQuantifier = async (
  db: duckdb.AsyncDuckDB,
  quantifier: Quantifier,
  interval?: string
) => {
  const conn = await db.connect()

  let res

  if (interval !== '1 day') {
    res = await conn?.query(`
      SELECT
        cast ( time_bucket ( interval ${interval}, d) as date) as date,
        ${quantifier.aggregate}(v) as value
      FROM ${quantifier.table}
      group by date
    `)
  } else {
    res = await conn?.query(
      `SELECT d as date, v as value FROM ${quantifier.table}`
    )
  }

  const data = arrowToJson(res).map((d: any) => ({
    x: parseISO(d.date),
    y: d.value,
  }))

  conn.close()

  return {
    id: quantifier.table,
    color: quantifier.color,
    data,
  }
}
