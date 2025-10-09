import { MapView } from './components/MapView';
import { ApiTest } from './components/ApiTest';
import 'primereact/resources/themes/saga-blue/theme.css';  // or another theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function App() {


  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MapView/>
      </div>
      <ApiTest></ApiTest>
    </>
  )
}

export default App
