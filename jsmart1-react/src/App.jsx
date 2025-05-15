import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './styles/main.css' // Import our modern design system
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import ErrorBoundary from './components/common/ErrorBoundary'

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
  faArrowDown,
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
  faInfoCircle,
  faExternalLinkAlt,
  faArrowRight,
  faSpinner,
  faBell,
  faCheckCircle,
  faEdit,
  faTrashAlt,
  faEye,
  faReply,
  faFileUpload,
  faFileCode,
  faSync,
  faExclamationTriangle,
  faTools,
  faWrench,
  // New feature icons
  faBuilding,
  faUserFriends,
  faMoneyBillAlt,
  faChartPie,
  faChartLine,
  faChartBar,
  faReceipt,
  faHandHoldingUsd,
  faDollarSign,
  faCoins,
  faIdCard,
  faAddressCard,
  faUserPlus,
  faUserMinus,
  faUserCog,
  faUserCheck,
  faUserSlash,
  faUsersGear,
  faUsersSlash,
  faUsersCog,
  faBalanceScale,
  faCalendar,
  faList,
  faListAlt,
  faTable,
  faTag,
  faTags,
  faClipboard,
  faClipboardList,
  faClipboardCheck,
  faMoneyCheck,
  faMoneyCheckAlt,
  faColumns,
  faSyncAlt,
  faImage,
  faUpload,
  faUndo
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
  faArrowDown,
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
  faInfoCircle,
  faExternalLinkAlt,
  faArrowRight,
  faSpinner,
  faBell,
  faCheckCircle,
  faEdit,
  faTrashAlt,
  faEye,
  faReply,
  faFileUpload,
  faFileCode,
  faSync,
  faExclamationTriangle,
  faTools,
  faWrench,
  // New feature icons
  faBuilding,
  faUserFriends,
  faMoneyBillAlt,
  faChartPie,
  faChartLine,
  faChartBar,
  faReceipt,
  faHandHoldingUsd,
  faDollarSign,
  faCoins,
  faIdCard,
  faAddressCard,
  faUserPlus,
  faUserMinus,
  faUserCog,
  faUserCheck,
  faUserSlash,
  faUsersGear,
  faUsersSlash,
  faUsersCog,
  faBalanceScale,
  faCalendar,
  faList,
  faListAlt,
  faTable,
  faTag,
  faTags,
  faClipboard,
  faClipboardList,
  faClipboardCheck,
  faMoneyCheck,
  faMoneyCheckAlt,
  faColumns,
  faSyncAlt,
  faImage,
  faUpload,
  faUndo
)

// Components
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Sermons from './pages/Sermons'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Ministries from './pages/Ministries'
import MinistryDetail from './pages/MinistryDetail'
import ContentDetail from './pages/ContentDetail'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Give from './pages/Give'
import TestPage from './pages/TestPage'
import SimpleTest from './pages/SimpleTest'
import SimpleEventDetail from './pages/SimpleEventDetail'
import TestBranches from './pages/TestBranches'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import MinistryManager from './pages/admin/MinistryManager'
import SermonManager from './pages/admin/SermonManager'
import EventManager from './pages/admin/EventManager'
import GalleryManager from './pages/admin/GalleryManager'
import ContactManager from './pages/admin/ContactManager'
import ContentManager from './pages/admin/ContentManager'

// New Admin Pages
import BranchManager from './pages/admin/BranchManager'
import FinanceManager from './pages/admin/FinanceManager'
import FinanceDetail from './pages/admin/FinanceDetail'
import FinanceReports from './pages/admin/FinanceReports'
import FinanceBudget from './pages/admin/FinanceBudget'
import BudgetReport from './pages/admin/BudgetReport'
import MemberManager from './pages/admin/MemberManager'
import MemberDetail from './pages/admin/MemberDetail'
import GroupManager from './pages/admin/GroupManager'
import TestSidebar from './pages/admin/TestSidebar'
import DirectSidebar from './pages/admin/DirectSidebar'
import ImageDebuggerPage from './pages/admin/ImageDebuggerPage'
import ImageVerifierPage from './pages/admin/ImageVerifierPage'
import ContentMigration from './pages/admin/ContentMigration'

// Finance Pages
import FinanceLogin from './pages/finance/Login'
import FinanceDashboard from './pages/finance/Dashboard'
import UnifiedDashboard from './pages/finance/UnifiedDashboard'

// This component will force a re-render when the location changes
const LocationAwareRoutes = () => {
  const location = useLocation();

  // Log the current location for debugging
  console.log('Current location:', location);

  return (
    <div className="App">
      {/* WhatsApp floating button - visible on all pages except admin and finance routes */}
      {!location.pathname.includes('/admin') && !location.pathname.includes('/finance') && (
        <WhatsAppButton phoneNumber="769080629" countryCode="255" />
      )}

      {/* Use the location.key as a key to force re-rendering when location changes */}
      <Routes key={location.key}>
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
            <Route path="/events/:id" element={
              <>
                <Header />
                <EventDetail />
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
            <Route path="/ministries/:id" element={
              <>
                <Header />
                <MinistryDetail />
                <Footer />
              </>
            } />
            <Route path="/content/:section" element={
              <>
                <Header />
                <ContentDetail />
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
            <Route path="/test" element={
              <>
                <Header />
                <TestPage />
                <Footer />
              </>
            } />
            <Route path="/simple-test" element={<SimpleTest />} />
            <Route path="/simple-event" element={<SimpleEventDetail />} />
            <Route path="/test-branches" element={<TestBranches />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/test-sidebar" element={<TestSidebar />} />
            <Route path="/admin/direct-sidebar" element={<DirectSidebar />} />

            {/* Church Management Routes */}
            <Route path="/admin/branches" element={<BranchManager />} />
            <Route path="/admin/members" element={<MemberManager />} />
            <Route path="/admin/members/:id" element={<MemberDetail />} />
            <Route path="/admin/groups" element={<GroupManager />} />

            {/* Admin Finance Routes - Only for admins */}
            <Route path="/admin/finances" element={<FinanceManager />} />
            <Route path="/admin/finances/:id" element={<FinanceDetail />} />
            <Route path="/admin/finances/reports" element={<FinanceReports />} />
            <Route path="/admin/finances/budget" element={<FinanceBudget />} />
            <Route path="/admin/finances/budget/report" element={<BudgetReport />} />

            {/* Finance User Routes - Separate panel for finance users */}
            <Route path="/finance/login" element={<FinanceLogin />} />
            <Route path="/finance" element={<UnifiedDashboard />} />
            <Route path="/finance/dashboard" element={<UnifiedDashboard />} />
            <Route path="/finance/unified" element={<UnifiedDashboard />} />
            <Route path="/finance/classic-dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/transactions" element={<FinanceManager />} />
            <Route path="/finance/transactions/:id" element={<FinanceDetail />} />
            <Route path="/finance/reports" element={<FinanceReports />} />
            <Route path="/finance/budget" element={<FinanceBudget />} />
            <Route path="/finance/budget/report" element={<BudgetReport />} />

            {/* Content Management Routes */}
            <Route path="/admin/ministries" element={<MinistryManager />} />
            <Route path="/admin/sermons" element={<SermonManager />} />
            <Route path="/admin/events" element={<EventManager />} />
            <Route path="/admin/gallery" element={<GalleryManager />} />
            <Route path="/admin/content" element={<ContentManager />} />

            {/* System Tools Routes */}
            <Route path="/admin/image-debugger" element={<ImageDebuggerPage />} />
            <Route path="/admin/image-verifier" element={<ImageVerifierPage />} />
            <Route path="/admin/content-migration" element={<ContentMigration />} />

            {/* Communication Routes */}
            <Route path="/admin/contact" element={<ContactManager />} />
          </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ContentProvider>
          <BrowserRouter>
            <LocationAwareRoutes />
          </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
