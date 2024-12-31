const DEFINE_ROUTERS_ADMIN = {
  home: '/admin',
  accountBalance: '/admin/accountBalance',
  courtManager: '/admin/court-manager',
  gatherManager: '/admin/gather-manager',
  courtDetail: '/admin/court-detail/:id',
  loginAdmin: '/login-admin',
};

const DEFINE_ROUTERS_USER = {
  home: '/',
  loginGoogle: '/login-google',
  courtPostDetail: '/court-post/:id',
  gatherPostDetail: '/gather-post/:id',
  profile: '/profile',
  badmintonCourtManager: '/badminton-court-manager',
  badmintonGatherManager: '/badminton-gather-manager',
  badmintonGatherDetail: '/badminton-gather-manager/:id',
  badmintonCourtDetail: '/badminton-court-manager/:id',
  newBadmintonCourt: '/new-badminton-court',
  newBadmintonGather: '/new-badminton-gather',
  listGatherPost: '/gather-post',
  userBooking: '/my-booking',
  gatherBooking: '/gather-booking',
  paymentSuccess: '/payment-success',
  paymentError: '/payment-error',
};

export { DEFINE_ROUTERS_ADMIN, DEFINE_ROUTERS_USER };
