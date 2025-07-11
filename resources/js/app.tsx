import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import GuestLayout from '@/components/layouts/GuestLayout'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} | ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).then((module) => {
      const typedModule = module as { default: { layout: (page: ReactNode) => ReactNode } }

      if (name === 'Welcome' || name.startsWith('quiz/')) {
          /* empty */
      } else if (name.startsWith('auth/')) typedModule.default.layout = (page) => <GuestLayout>{page}</GuestLayout>
       else typedModule.default.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>
      return typedModule
    }),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  progress: {
    color: '#3B82F6',
  },
}).then()
