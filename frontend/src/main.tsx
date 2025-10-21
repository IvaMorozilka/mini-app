import { createRoot } from 'react-dom/client'
// import './index.css'
import '@maxhub/max-ui/dist/styles.css';
import { MaxUI } from '@maxhub/max-ui';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <MaxUI platform='ios' colorScheme='light'>
    <App/>
  </MaxUI>
)
