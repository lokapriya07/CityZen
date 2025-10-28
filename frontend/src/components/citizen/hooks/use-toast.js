"use client"

import * as React from "react"

export function useToast() {
  const toast = React.useCallback((props) => {
    // Simple toast implementation - in a real app you'd use a proper toast library
    console.log("Toast:", props)

    // Create a simple toast notification
    const toastElement = document.createElement("div")
    toastElement.className =
      "fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm"
    toastElement.innerHTML = `
      <div class="font-semibold text-gray-900">${props.title || ""}</div>
      <div class="text-sm text-gray-600 mt-1">${props.description || ""}</div>
    `

    document.body.appendChild(toastElement)

    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement)
      }
    }, 3000)
  }, [])

  return { toast }
}