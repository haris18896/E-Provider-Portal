// ** React Imports
import { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// ** Redux Imports
import { store } from './redux/store'
import { Provider } from 'react-redux'

// ** Intl, CASL & ThemeColors Context
import themeConfig from './configs/themeConfig'
import { ThemeContext } from './utility/context/ThemeColors'
import ability from './configs/acl/ability'
import { AbilityContext } from './utility/context/Can'

// ** Toast
import { Toaster } from 'react-hot-toast'

// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner'

// ** i18n
import './configs/i18n'

// ** Ripple Button
import './@core/components/ripple-button'

// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'
import '@styles/react/libs/react-select/_react-select.scss'

// ** React Hot Toast Styles
import '@styles/react/libs/react-hot-toasts/react-hot-toasts.scss'

// ** Core styles
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'
import './assets/scss/app.scss'

// date and time picker
import '@styles/react/libs/flatpickr/flatpickr.scss'

// Editor
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// ** Service Worker
import * as serviceWorker from './serviceWorker'

import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripePublicKey } from './stripe/config/StripeConfig'
// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <AbilityContext.Provider value={ability}>
          <ThemeContext>
            <Elements stripe={loadStripe(StripePublicKey)}>
              <LazyApp />
              <Toaster
                position={themeConfig.layout.toastPosition}
                toastOptions={{ className: 'react-hot-toast' }}
              />
            </Elements>
          </ThemeContext>
        </AbilityContext.Provider>
      </Suspense>
    </Provider>
  </BrowserRouter>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
