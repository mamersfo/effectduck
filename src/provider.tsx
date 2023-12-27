import { useEffect, useState, createContext, useContext } from 'react'

import * as duckdb from '@duckdb/duckdb-wasm'
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

import { load } from './lib/util'

const Context = createContext({ db: null } as { db: duckdb.AsyncDuckDB | null })

export default function Provider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null)
  const [worker, setWorker] = useState<Worker | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Select a bundle based on browser checks
        const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)

        // Instantiate the asynchronus version of DuckDB-wasm
        const worker = new Worker(bundle.mainWorker!)
        setWorker(() => worker)

        const logger = new duckdb.ConsoleLogger()
        const db = new duckdb.AsyncDuckDB(logger, worker)

        await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

        Promise.all([
          load(db, 'data/bodymass.parquet', 'bodymass'),
          load(db, 'data/vo2max.parquet', 'vo2max'),
        ])

        setDb(() => db)
      } catch (e) {
        console.error('init error:', e)
      }
    }

    if (!db && !worker) {
      init()
    }

    return () => {
      console.log('Provider.useEffect.terminate')
      worker?.terminate()
      db?.terminate()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    db,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useDb = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`useDb must be used within a Provider.`)
  }
  return context
}

const MANUAL_BUNDLES = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: eh_worker,
  },
}
