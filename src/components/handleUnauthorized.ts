import Swal from 'sweetalert2'
import { useAuthStore } from '../store/auth.store'

export function handleUnauthorized() {
  return new Promise<void>((resolve) => {
    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      willClose: () => {
        useAuthStore.getState().setToken(null)
        window.location.href = '/auth'
        resolve()
      },
    })
  })
}


