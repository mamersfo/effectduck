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
    select * from 'buffer.${table}.parquet'
    where startdate >= '2022-01-01'
  `)

  conn.close()
}

export const readTable = async (
  db: duckdb.AsyncDuckDB,
  id: string,
  color: string
) => {
  const conn = await db.connect()

  const res = await conn?.query(
    `SELECT startdate, value FROM ${id} order by startdate;`
  )

  const data = arrowToJson(res).map((d: any) => ({
    x: parseISO(d.startdate),
    y: d.value,
  }))

  conn.close()

  return {
    id,
    color,
    data,
  }
}
