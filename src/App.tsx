import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import Layout from "./components/Layout/Layout"
import HomePage from "./pages/HomePage/HomePage"
import SearchResults from "./pages/SearchResults/SearchResults"
import SeatSelection from "./pages/SeatSelection/SeatSelection"
import PassengerInfo from "./pages/PassengerInfo/PassengerInfo"
import Payment from "./pages/Payment/Payment"
import BookingConfirmation from "./pages/BookingConfirmation/BookingConfirmation"
import "./index.css"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/seats/:scheduleId" element={<SeatSelection />} />
            <Route path="/passenger-info" element={<PassengerInfo />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App
