import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/not-found';
import TheLayout from '../components/layout/TheLayout';
import ListBadmintonCourtPost from '../modules/user/list-badminton-court-post/ListBadmintonCourtPost';
import {
  DEFINE_ROUTERS_ADMIN,
  DEFINE_ROUTERS_USER,
} from '../constants/routers-mapper';
import Profile from '../modules/user/profile/Profile';
import BadmintonCourtRoot from '../modules/user/badminton-court-manager/BadmintonCourtRoot';
import CreateBadmintonCourt from '../modules/user/badminton-court-manager/CreateBadmintonCourt';
import BadmintonCourtDetail from '../modules/user/badminton-court-manager/detail/BadmintonCourtDetail';
import AdminPage from '../modules/admin/AdminPage';
import LoginAdminPage from '../modules/admin/LoginAdminPage';
import PostDetail from '../modules/user/list-badminton-court-post/postDetail/PostDetail';
import ListCourtBooking from '../modules/user/user-booking/ListCourtBooking';
import BadmintonGatherManager from '../modules/user/badminton-gather-manager/BadmintonGatherManager';
import CreateBadmintonGather from '../modules/user/badminton-gather-manager/CreateBadmintonGather';
import BadmintonGatherDetail from '../modules/user/badminton-gather-manager/detail/BadmintonGatherDetail';
import ListBadmintonGatherPost from '../modules/user/list-badminton-gather-post/ListBookingGatherPost';
import GatherPostDetail from '../modules/user/list-badminton-gather-post/postDetail/GatherPostDetail';
import ListGatherBooking from '../modules/user/user-booking/ListGatherBooking';
import LoginByGoogle from '../modules/auth/login/LoginByGoogle';
import CourtDetail from '../modules/admin/CourtDetail';
import TheLayoutAdmin from '../modules/admin/layout/TheLayoutAdmin';
import AccountBalanceAdmin from '../modules/admin/AccountBalanceAdmin';

const router = createBrowserRouter([
  {
    path: DEFINE_ROUTERS_USER.home,
    errorElement: <ErrorPage />,
    Component: TheLayout,
    children: [
      {
        index: true,
        path: '',
        element: <ListBadmintonCourtPost />,
      },
      {
        path: DEFINE_ROUTERS_USER.courtPostDetail,
        element: <PostDetail />,
      },
      {
        path: DEFINE_ROUTERS_USER.gatherPostDetail,
        element: <GatherPostDetail />,
      },
      {
        path: DEFINE_ROUTERS_USER.listGatherPost,
        element: <ListBadmintonGatherPost />,
      },
      {
        path: DEFINE_ROUTERS_USER.profile,
        element: <Profile />,
      },
      {
        path: DEFINE_ROUTERS_USER.userBooking,
        element: <ListCourtBooking />,
      },
      {
        path: DEFINE_ROUTERS_USER.gatherBooking,
        element: <ListGatherBooking />,
      },
      {
        path: DEFINE_ROUTERS_USER.badmintonGatherManager,
        element: <BadmintonGatherManager />,
      },
      {
        path: DEFINE_ROUTERS_USER.badmintonCourtManager,
        element: <BadmintonCourtRoot />,
      },
      {
        path: DEFINE_ROUTERS_USER.newBadmintonGather,
        element: <CreateBadmintonGather />,
      },
      {
        path: DEFINE_ROUTERS_USER.badmintonGatherDetail,
        element: <BadmintonGatherDetail />,
      },
      {
        path: DEFINE_ROUTERS_USER.newBadmintonCourt,
        element: <CreateBadmintonCourt />,
      },
      {
        path: DEFINE_ROUTERS_USER.badmintonCourtDetail,
        element: <BadmintonCourtDetail />,
      },
    ],
  },
  {
    path: DEFINE_ROUTERS_ADMIN.home,
    Component: TheLayoutAdmin,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: DEFINE_ROUTERS_ADMIN.courtDetail,
        element: <CourtDetail />,
      },
      {
        path: DEFINE_ROUTERS_ADMIN.accountBalance,
        element: <AccountBalanceAdmin />,
      }
    ]
  },
  {
    path: DEFINE_ROUTERS_ADMIN.loginAdmin,
    element: <LoginAdminPage />,
  },
  {
    path: DEFINE_ROUTERS_USER.loginGoogle,
    element: <LoginByGoogle />,
  },
]);

export default router;
