import React from 'react'
import { Box, Typography } from '@mui/material'
import { Loader } from '../ui'

interface StatsCardProps {
  value: string | number
  label: string
  backgroundColor: string
  textColor: string
  captionColor: string
  loading: boolean
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  backgroundColor,
  textColor,
  captionColor,
  loading
}) => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor,
        borderRadius: 2,
        textAlign: 'center'
      }}
    >
      {loading?
        <Box sx={{display:'flex', justifyContent: 'center',py:1}}>
          <Loader size={20} thickness={4}/>
        </Box>
        :<Typography
          variant="h6"
          sx={{ fontWeight: 700, color: textColor }}
        >
          {value}
        </Typography>
      }
      <Typography
        variant="caption"
        sx={{ color: captionColor }}
      >
        {label}
      </Typography>
    </Box>
  )
}

export default StatsCard
