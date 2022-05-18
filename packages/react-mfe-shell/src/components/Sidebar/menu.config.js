export const sideMenu = [
  {
    label: 'Home',
    Icon: 'agent',
    to: '/',
  },
  {
    label: 'Profile',
    Icon: 'help',
    to: '/profile',
  },
  {
    label: 'Settings',
    Icon: 'alert',
    to: '/settings',
    children: [
      {
        label: 'Account',
        Icon: 'agent',
        to: 'account',
      },
      {
        label: 'Security',
        Icon: 'explore',
        to: 'security',
        children: [
          {
            label: 'Credentials',
            Icon: 'cross',
            to: 'credentials',
          },
          {
            label: '2-FA',
            Icon: 'browser',
            to: '2fa',
          },
        ],
      },
    ],
  },
];
