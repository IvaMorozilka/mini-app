import { Button } from '@maxhub/max-ui'
import Header from './components/Header'
import Footer from './components/Footer'
import Services from './views/Services'
function App() {
  return (
    <>
    {/* Header */}
    <Header/>
    {/* Тут будет рисоваться страница, сейчас тут кнопка*/}
      <div>
        <Services/>
      </div>
      {/* Здесь будет нижнее меню, Footer*/}
      <Footer/>
    </>
  )
}

export default App
