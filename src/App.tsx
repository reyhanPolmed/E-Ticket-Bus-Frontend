import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/layout/Layout";
import SearchResult from "./pages/SearchResult";
import SeatSelection from "./pages/SeatSelection";
import PassengerInfo from "./pages/PassengerInfo";
import BookingConfirmation from "./pages/BookingConfirmation";
import Payments from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WaitingPayment from "./pages/WaitingPayment";
import BookingSuccess from "./pages/BookingSuccess";
import BookingHistory from "./pages/BookingHistory";
import RequireAuth from "./components/RequireAuth";
import Toast from "./components/Toast";

const PrivateRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<SearchResult />} />
          <Route path="/seat" element={<SeatSelection />} />
          <Route path="/passenger-data" element={<PassengerInfo />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/waiting-payment" element={<WaitingPayment />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/success" element={<BookingSuccess />} />
        </Route>
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <>
      <Toast />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PrivateRoutes />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
