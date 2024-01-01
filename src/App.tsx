import { useEffect, useState } from 'react'
import { LineChart } from './charts/line-chart'
import { useDb } from './provider'
import { readQuantifier } from './lib/util'
import { Quantifier, quantifiers } from './types'

function App() {
  const [data, setData] = useState<any[]>([])
  const [interval, setInterval] = useState<string | undefined>('1 month')
  const [quantifier, setQuantifier] = useState<Quantifier | undefined>(
    undefined
  )

  const { db } = useDb()

  useEffect(() => {
    if (db && quantifier && interval) {
      readQuantifier(db, quantifier, interval).then((data) => setData([data]))
    }
  }, [db, quantifier, interval])

  return (
    <div className='p-8 prose flex flex-col gap-4'>
      <h1>Apple Health</h1>
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-4'>
          {quantifiers.map((q, idx) => (
            <a
              key={`data-table-${idx}`}
              className='link'
              onClick={() => setQuantifier(q)}
            >
              {q.table}
            </a>
          ))}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row gap-4'>
            <div role='tablist' className='tabs tabs-bordered w-42'>
              <input
                type='radio'
                name='my_tabs_1'
                role='tab'
                className='tab'
                aria-label='day'
                checked={interval === '1 day'}
                onClick={() => setInterval('1 day')}
              />
              <input
                type='radio'
                name='my_tabs_1'
                role='tab'
                className='tab'
                aria-label='month'
                checked={interval === '1 month'}
                onClick={() => setInterval('1 month')}
              />
            </div>
          </div>{' '}
          {data && (
            <div className='w-[1024px] h-[512px]'>
              <LineChart
                data={data}
                unit={`${quantifier?.unit} (${quantifier?.aggregate})`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
