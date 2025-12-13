"use client"

import { toast } from "sonner"

export const showToast = (type, message, promiseOptions = null) => {
  switch (type) {
    case "success":
      return toast.success(message)

    case "info":
      return toast.info(message)

    case "warning":
      return toast.warning(message)

    case "error":
      return toast.error(message)

    case "promise":
      // message = a function that returns a Promise
      // promiseOptions = { loading, success, error }
      return toast.promise(message, promiseOptions)

    default:
      return toast(message)
  }
}
