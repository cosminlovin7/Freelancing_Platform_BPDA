import './App.css'
import {DappProvider} from "@multiversx/sdk-dapp/wrappers";
import {ENVIRONMENT} from "config";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {HomePage} from "pages/HomePage/HomePage";
import {UnlockPage} from "pages/UnlockPage/UnlockPage";
import {SignTransactionsModals, TransactionsToastList} from "@multiversx/sdk-dapp/UI";

function App() {

  return (
    <DappProvider
        environment={ENVIRONMENT}
    >
      <Router>
          <SignTransactionsModals/>
          <TransactionsToastList/>
          <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/unlock" element={<UnlockPage/>}/>
          </Routes>
      </Router>
    </DappProvider>
  )
}

export default App
