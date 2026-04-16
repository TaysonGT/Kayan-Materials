import React from 'react'
import { Box, Typography } from '@mui/material'

interface StatsCardProps {
  value: string | number
  label: string
  backgroundColor: string
  textColor: string
  captionColor: string
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  backgroundColor,
  textColor,
  captionColor
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
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: textColor }}
      >
        {value}
      </Typography>
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
