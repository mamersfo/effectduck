import * as arrow from 'apache-arrow'
import * as duckdb from '@duckdb/duckdb-wasm'
import { parseISO } from 'date-fns'

export const arrowToJson = (data: arrow.Table<unknown>) => {
  return JSON.parse(
    JSON.stringify(data.toArray(), (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

export const load = async (
  db: duckdb.AsyncDuckDB,
  path: string,
  table: string
) => {
  const conn = await db.connect()

  let res = await fetch(path)

  await db.registerFileBuffer(
    `buffer.${table}.parquet`,
    new Uint8Array(await res.arrayBuffer())
  )

  await conn.query(`
    create table ${table} as 
    select 
      date, 
      value 
    from 'buffer.${table}.parquet'
    where date >= '2022-04-01'
  `)

  conn.close()
}

export const readTable = async (
  db: duckdb.AsyncDuckDB,
  id: string,
  color: string
) => {
  const conn = await db.connect()

  const res = await conn?.query(`SELECT * FROM ${id}`)

  const data = arrowToJson(res).map((d: any) => ({
    x: parseISO(d.date),
    y: d.value,
  }))

  conn.close()

  return {
    id,
    color,
    data,
  }
}
