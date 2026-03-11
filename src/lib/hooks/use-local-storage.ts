'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Error reading localStorage:', error)
    }
    setIsHydrated(true)
  }, [key])

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      if (value instanceof Function) {
        setStoredValue((currentValue) => {
          const newValue = value(currentValue)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(newValue))
          }
          return newValue
        })
      } else {
        setStoredValue(value)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      }
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }

  return [storedValue, setValue]
}
