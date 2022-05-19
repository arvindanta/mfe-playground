export const sideMenu = [
  {
    label: 'Home',
    Icon: 'agent',
    to: '/',
  },
  {
    label: 'MFE',
    Icon: 'help',
    to: '/mfe',
  },
  {
    label: 'About',
    Icon: 'explore',
    to: '/about',
  },
  {
    label: 'Settings',
    Icon: 'alert',
    to: '/settings',
    children: [
      {
        label: 'About',
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
