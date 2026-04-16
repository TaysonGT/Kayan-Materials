import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

interface Props{
    open: boolean;
    title: string
    content: string
    type?: 'save' | 'delete'
    onConfirm: ()=>void
    onCancel: ()=>void
}

const ConfirmDialog:React.FC<Props> = ({open, onConfirm, onCancel, title, content, type}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>إلغاء</Button>
        <Button onClick={onConfirm} variant="contained" color={type==="save"?"primary":"error"}>
          {type==="save"?"حفظ":"حذف"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog