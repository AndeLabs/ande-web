import { Metadata } from 'next'
import { FaucetAdmin } from '@/components/faucet/faucet-admin'
// import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin - Faucet | ANDE Network',
  description: 'Panel de administración del faucet de ANDE Network',
}

// Esta función verifica si el usuario tiene permisos de administrador
async function checkAdminPermissions() {
  // Por ahora, permitimos acceso (implementar autenticación real después)
  return true
  
  // En producción, verificarías roles específicos en la base de datos
  const adminAddresses = [
    process.env.NEXT_PUBLIC_ADMIN_ADDRESS_1,
    process.env.NEXT_PUBLIC_ADMIN_ADDRESS_2,
    // Agregar más direcciones de administradores aquí
  ].filter(Boolean)

  // Temporalmente deshabilitado hasta tener auth configurado
  // const session = await auth()
  // if (!session?.user?.address) {
  //   return false
  // }
  // return adminAddresses.includes(session.user.address.toLowerCase())
}

export default async function FaucetAdminPage() {
  const isAdmin = await checkAdminPermissions()

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
            <p className="text-gray-600 mb-6">
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Esta página está restringida a administradores del faucet</p>
              <p>• Si crees que esto es un error, contacta al equipo de desarrollo</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Información de Acceso:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Dirección actual: {typeof window !== 'undefined' ? 'No disponible' : 'Cargando...'}</li>
              <li>• Permisos requeridos: Administrador de Faucet</li>
              <li>• Estado de autenticación: {isAdmin ? 'Autorizado' : 'No autorizado'}</li>
            </ul>
          </div>

          <div className="mt-6">
            <a
              href="/faucet"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Faucet
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Gestiona el faucet de ANDE Network
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Admin
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Faucet Manager
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de seguridad */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-amber-800">Zona Restringida</h3>
            <p className="mt-1 text-sm text-amber-700">
              Esta área contiene funciones administrativas sensibles. Todas las acciones están registradas para auditoría.
            </p>
          </div>
        </div>
      </div>

      <FaucetAdmin />
      
      {/* Información del sistema */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Información del Sistema</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Versión del Faucet:</dt>
              <dd className="text-gray-900">v1.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Red:</dt>
              <dd className="text-gray-900">ANDE Network (Chain ID: 6174)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">RPC:</dt>
              <dd className="text-gray-900 font-mono text-xs">https://rpc.ande.network</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Explorer:</dt>
              <dd className="text-gray-900 font-mono text-xs">https://explorer.ande.network</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Última actualización:</dt>
              <dd className="text-gray-900">{new Date().toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Configuración Actual</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Monto por claim:</dt>
              <dd className="text-gray-900">100 ANDE</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Cooldown:</dt>
              <dd className="text-gray-900">24 horas</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Límite diario:</dt>
              <dd className="text-gray-900">3 claims por dirección</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Gas limit:</dt>
              <dd className="text-gray-900">21,000</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600">Gas price:</dt>
              <dd className="text-gray-900">20 Gwei</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}