import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faCcVisa, faCcMastercard, faPaypal, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faBookOpen,
  faCross,
  faDove,
  faCrown,
  faBible,
  faHeartBroken,
  faGift,
  faUsers,
  faStar,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faArrowUp,
  faChevronDown,
  faPlay,
  faHeadphones,
  faDownload,
  faFileAlt,
  faSearch,
  faChevronRight,
  faMobileAlt,
  faChurch,
  faMoneyBillWave,
  faHandsHelping,
  faGraduationCap,
  faSearchPlus,
  faTimes,
  faRss,
  faChevronLeft,
  faUserTie,
  faChalkboardTeacher,
  faBriefcase,
  faSchool,
  faMusic,
  faUtensils,
  faHeartbeat,
  faHome,
  faBullhorn,
  faGlobeAfrica,
  faNetworkWired,
  faHands,
  faPlus,
  faMinus,
  // Admin icons
  faLock,
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUserCircle,
  faCog,
  faTachometerAlt,
  faCalendarAlt,
  faImages,
  faExclamationCircle,
  faExternalLinkAlt,
  faArrowRight,
  faSpinner,
  faBell,
  faCheckCircle,
  faEdit,
  faTrashAlt,
  faEye,
  faReply,
  faFileUpload
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(fab)

// Add solid icons individually
library.add(
  faBookOpen,
  faCross,
  faDove,
  faCrown,
  faBible,
  faHeartBroken,
  faGift,
  faUsers,
  faStar,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faArrowUp,
  faChevronDown,
  faPlay,
  faHeadphones,
  faDownload,
  faFileAlt,
  faSearch,
  faChevronRight,
  faMobileAlt,
  faChurch,
  faMoneyBillWave,
  faHandsHelping,
  faGraduationCap,
  faSearchPlus,
  faTimes,
  faRss,
  faChevronLeft,
  faUserTie,
  faChalkboardTeacher,
  faBriefcase,
  faSchool,
  faMusic,
  faUtensils,
  faHeartbeat,
  faHome,
  faBullhorn,
  faGlobeAfrica,
  faNetworkWired,
  faHands,
  faPlus,
  faMinus,
  // Admin icons
  faLock,
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUserCircle,
  faCog,
  faTachometerAlt,
  faCalendarAlt,
  faImages,
  faExclamationCircle,
  faExternalLinkAlt,
  faArrowRight,
  faSpinner,
  faBell,
  faCheckCircle,
  faEdit,
  faTrashAlt,
  faEye,
  faReply,
  faFileUpload
)

// Components
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Sermons from './pages/Sermons'
import Events from './pages/Events'
import Ministries from './pages/Ministries'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Give from './pages/Give'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import MinistryManager from './pages/admin/MinistryManager'
import SermonManager from './pages/admin/SermonManager'
import EventManager from './pages/admin/EventManager'
import GalleryManager from './pages/admin/GalleryManager'
import ContactManager from './pages/admin/ContactManager'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <About />
                <Footer />
              </>
            } />
            <Route path="/sermons" element={
              <>
                <Header />
                <Sermons />
                <Footer />
              </>
            } />
            <Route path="/events" element={
              <>
                <Header />
                <Events />
                <Footer />
              </>
            } />
            <Route path="/ministries" element={
              <>
                <Header />
                <Ministries />
                <Footer />
              </>
            } />
            <Route path="/gallery" element={
              <>
                <Header />
                <Gallery />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <Contact />
                <Footer />
              </>
            } />
            <Route path="/give" element={
              <>
                <Header />
                <Give />
                <Footer />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/ministries" element={<MinistryManager />} />
            <Route path="/admin/sermons" element={<SermonManager />} />
            <Route path="/admin/events" element={<EventManager />} />
            <Route path="/admin/gallery" element={<GalleryManager />} />
            <Route path="/admin/contact" element={<ContactManager />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
