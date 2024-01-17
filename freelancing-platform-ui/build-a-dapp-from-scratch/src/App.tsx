import './App.css'
import {DappProvider} from "@multiversx/sdk-dapp/wrappers";
import {ENVIRONMENT} from "config";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {UnlockPage} from "pages/UnlockPage/UnlockPage";
import {SignTransactionsModals, TransactionsToastList} from "@multiversx/sdk-dapp/UI";
import {HomePagev2} from "./pages/HomePage/HomePagev2.tsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <DappProvider
        environment={ENVIRONMENT}
    >
      <Router>
          <ToastContainer/>
          <SignTransactionsModals/>
          <TransactionsToastList/>
          <Routes>
              <Route path="/unlock" element={<UnlockPage/>}/>
              <Route path="/" element={<HomePagev2/>}/>
          </Routes>
      </Router>
    </DappProvider>
  )
}

export default App
