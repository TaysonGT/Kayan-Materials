import type { Supplier, Material } from '../types'

/**
 * Find supplier name by ID
 */
export const getSupplierName = (id: string, suppliers: Supplier[]): string => {
  return suppliers.find(s => s.id === id)?.name || ''
}

/**
 * Find material name by ID
 */
export const getMaterialName = (id: string, materials: Material[]): string => {
  return materials.find(m => m.id === id)?.name || ''
}

/**
 * Get supplier names from array of supplier IDs
 */
export const getSupplierNames = (ids: string[] = [], suppliers: Supplier[]): string => {
  if (!ids.length) return '-'
  return ids
    .map(id => getSupplierName(id, suppliers))
    .filter(Boolean)
    .join(', ')
}

/**
 * Generate next available ID for an array of items
 */
export const generateNextId = <T extends { id: string }>(items: T[]): number => {
  if (!items.length) return 1
  return Math.max(...items.map(item => parseInt(item.id))) + 1
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(amount)
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{7,}$/
  return phoneRegex.test(phone)
}

export const formatDateInput = (date: string|number|Date): string => {
  return new Date(date).toISOString().split('T')[0]
}

export const formatDateDisplay = (date: string|number|Date): string => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}