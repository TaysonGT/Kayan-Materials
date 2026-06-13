import React from 'react'
import { Loader } from '../ui'

interface StatsCardProps {
  value: string | number
  label: string
  loading: boolean
  icon?: React.ReactNode
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  loading,
  icon
}) => {
  return (
    <div className="rounded p-4 flex flex-col gap-2 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 text-[#7f7f7f] font-bold">
        <div className="text-base font-extrabold">{label}</div>
        <span className='text-xl p-1 bg-[#f7f7f7] rounded-lg border border-[#d3d3d3]'>{icon}</span>
      </div>
      {loading ? (
        <div className="flex justify-center py-3">
          <Loader size={20} thickness={4} />
        </div>
      ) : (
        <div className="text-black p-2 text-2xl font-bold">{value}</div>
      )}
    </div>
  )
}

export default StatsCard
