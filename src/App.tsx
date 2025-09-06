import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Layout from "./components/layout/Layout"
import SearchResult from "./pages/SearchResult"
import SeatSelection from "./pages/SeatSelection"
import PassengerInfo from "./pages/PassengerInfo"
import BookingConfirmation from "./pages/BookingConfirmation"
import Payments from "./pages/Payment"
import Login from "./pages/Login"
import Register from "./pages/Register"

const PrivateRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResult />} />
                <Route path="/seat" element={<SeatSelection />} />
                <Route path="/passenger-info" element={<PassengerInfo />} />
                <Route path="/confirmation" element={<BookingConfirmation />} />
                <Route path="/payment" element={<Payments />} />
            </Routes>
        </Layout>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<PrivateRoutes />} />
            </Routes>
        </Router>
    );
}

export default App
