import React from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/')} size="small">
          <FiArrowRight />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Button
        dir='ltr'
        variant="contained"
        startIcon={<FiPlus />}
        onClick={onAddClick}
      >
        {buttonText}
      </Button>
    </Box>
  )
}

export default PageHeader
