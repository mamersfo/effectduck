import { useState } from 'react'
import { LineChart } from './charts/line-chart'
import { useDb } from './provider'
import { readTable } from './lib/util'

function App() {
  const [vo2max, setVo2max] = useState<any>()
  const [bodyMass, setBodyMass] = useState<any>()
  const [data, setData] = useState<any[]>([])

  const { db } = useDb()

  const loadVo2max = async () => {
    let data

    if (vo2max) {
      data = vo2max
    } else {
      data = await readTable(db!, 'vo2max', 'hsl(341, 70%, 50%)')
      setVo2max(data)
    }

    setData([data])
  }

  const loadBodyMass = async () => {
    let data

    if (bodyMass) {
      data = bodyMass
    } else {
      data = await readTable(db!, 'bodyMass', 'hsl(166, 21%, 65%)')
      setBodyMass(data)
    }

    setData([data])
  }

  return (
    <div className='p-8 prose'>
      <h1>EffectDuck</h1>
      <div className='flex flex-row gap-4'>
        <button className='btn' onClick={loadVo2max}>
          vo2max
        </button>
        <button className='btn' onClick={loadBodyMass}>
          bodyMass
        </button>
      </div>
      {data && (
        <div className='w-[1024px] h-[512px]'>
          <LineChart data={data} />
        </div>
      )}
      {/* <pre className='text-sm'>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  )
}

export default App
