import React from 'react'
import { FiPlus, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router'

interface PageHeaderProps {
  title: string
  subtitle: string
  buttonText: string
  onAddClick: () => void
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  buttonText,
  onAddClick
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/')} className="p-1 rounded text-gray-700 hover:bg-gray-200">
          <FiArrowRight />
        </button>
        <div>
          <h4 className="text-2xl font-bold">{title}</h4>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        onClick={onAddClick}
      >
        <FiPlus />
        <span>{buttonText}</span>
      </button>
    </div>
  )
}

export default PageHeader
