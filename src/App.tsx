import { useState } from 'react'
import { LineChart } from './charts/line-chart'
import { useDb } from './provider'
import { arrowToJson } from './lib/util'
import { parse } from 'date-fns'

function App() {
  const [vo2max, setVo2max] = useState<any>()

  const { db } = useDb()

  const handleClick = async () => {
    const conn = await db?.connect()
    const table = await conn?.query(`SELECT creationdate, value FROM vo2max;`)

    const now = new Date()

    const data = arrowToJson(table).map((d: any) => ({
      x: parse(d.creationdate, 'yyyy-MM-dd HH:mm:ss xx', now),
      y: d.value,
    }))

    setVo2max({
      id: 'vo2max',
      color: 'hsl(341, 70%, 50%)',
      data,
    })

    conn?.close()
  }

  const data: any[] = []

  if (vo2max) data.push(vo2max)

  return (
    <div className='p-8 prose'>
      <h1>EffectDuck</h1>
      <div className='flex flex-row gap-4'>
        <button className='btn' onClick={handleClick}>
          vo2max
        </button>
      </div>
      {data && (
        <div className='w-[1024px] h-[512px]'>
          <LineChart data={data} />
        </div>
      )}
    </div>
  )
}

export default App
