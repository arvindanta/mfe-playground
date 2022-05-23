import { MFEController } from '../../controller';
export const sideMenu = [
  {
    label: 'Home',
    Icon: 'agent',
    to: '/',
  },
  {
    label: 'MFE1',
    Icon: 'help',
    to: '/mfe1',
    children: [
      {
        label: 'send message to MFE1',
        Icon: 'freshchat',
        onClick: (e) => {
          e.preventDefault();
          window.log('sending message to MFE reactMFE1 from App Shell');

          MFEController.init('mfe1').publish?.({
            eventName: 'from_app_shell',
            action: {
              type: 'from_app_shell',
              sender: 'app shell',
            },
            payload: 'from app shell',
          });
        },
      },
      {
        label: 'change route in MFE1',
        Icon: 'forward',
        onClick: (e) => {
          e.preventDefault();
          window.log(
            'sending message to MFE reactMFE1 to change route from App Shell'
          );

          MFEController.init('mfe1').publish?.({
            eventName: 'route_change_app_shell',
            action: {
              type: 'from_app_shell',
              sender: 'app shell',
            },
            payload: { to: 'about' },
          });
        },
      },
    ],
  },
  {
    label: 'MFE2',
    Icon: 'help',
    to: '/mfe2',
    children: [
      {
        label: 'send message to MFE2',
        Icon: 'freshchat',
        onClick: (e) => {
          e.preventDefault();
          window.log('sending message to MFE reactMFE2 from App Shell');

          MFEController.init('mfe2').publish?.({
            eventName: 'from_app_shell',
            action: {
              type: 'from_app_shell',
              sender: 'app shell',
            },
            payload: 'from app shell',
          });
        },
      },
      {
        label: 'change route in MFE2',
        Icon: 'forward',
        onClick: (e) => {
          e.preventDefault();
          window.log(
            'sending message to MFE reactMFE2 to change route from App Shell'
          );

          MFEController.init('mfe2').publish?.({
            eventName: 'route_change_app_shell',
            action: {
              type: 'from_app_shell',
              sender: 'app shell',
            },
            payload: { to: 'about' },
          });
        },
      },
    ],
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
