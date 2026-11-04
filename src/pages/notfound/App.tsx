import ErrorCatcher from '@ui/ErrorCatcher'
import { useLangUpgrade } from '@hooks/useLang'
import { useSlowNotice } from '@hooks/useSlowNotice'
import { useSmartPrefetch } from '@hooks/useSmartPrefetch'
import { otherPages } from '@lib/pages'
import NotFoundPage from './NotFoundPage'

export default function App() {
  useLangUpgrade()
  useSlowNotice()
  useSmartPrefetch(otherPages('/404'))
  return (
    <ErrorCatcher>
      <NotFoundPage />
    </ErrorCatcher>
  )
}
