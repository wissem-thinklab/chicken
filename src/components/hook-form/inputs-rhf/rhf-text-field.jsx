import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export default function RHFTextField({ name, helperText, type, placeholder, ...other }) {
  const { control } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
              error ? 'border-red-500' : ''
            }`}
            {...other}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    />
  )
}
