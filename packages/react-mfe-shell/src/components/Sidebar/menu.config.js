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
          window.log('sending message to MFE reactMFE1 from App Shell', true);

          MFEController.namespace('mfe1').publish({
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
        label: 'send message to MFE10',
        Icon: 'freshchat',
        onClick: (e) => {
          e.preventDefault();
          window.log(
            'sending message to MFE 10 reactMFE1 from App Shell',
            true
          );

          MFEController.namespace('mfe10').publish({
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
            'sending message to MFE reactMFE1 to change route from App Shell',
            true
          );

          MFEController.namespace('mfe1').publish({
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
          window.log('sending message to MFE reactMFE2 from App Shell', true);

          MFEController.namespace('mfe2').publish({
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
            'sending message to MFE reactMFE2 to change route from App Shell',
            true
          );

          MFEController.namespace('mfe2').publish({
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
    label: 'MFE3',
    Icon: 'help',
    to: '/mfe3',
    children: [
      {
        label: 'send message to MFE3',
        Icon: 'freshchat',
        onClick: (e) => {
          e.preventDefault();
          window.log('sending message to MFE reactMFE3 from App Shell', true);

          MFEController.namespace('mfe3').publish({
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
        label: 'send message to MFE10',
        Icon: 'freshchat',
        onClick: (e) => {
          e.preventDefault();
          window.log(
            'sending message to MFE 10 reactMFE3 from App Shell',
            true
          );

          MFEController.namespace('mfe10').publish({
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
        label: 'change route in MFE3',
        Icon: 'forward',
        onClick: (e) => {
          e.preventDefault();
          window.log(
            'sending message to MFE reactMFE3 to change route from App Shell',
            true
          );

          MFEController.namespace('mfe3').publish({
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
    label: 'WebcMFE1',
    Icon: 'alert',
    to: '/webcmfe1',
  },
  {
    label: 'StencilMFE1',
    Icon: 'agent',
    to: '/stencilmfe1',
  },
  {
    label: 'COMFE',
    Icon: 'help',
    to: '/comfe',
  },
  {
    label: 'EmberMFE',
    Icon: 'alert',
    to: '/embermfe',
    children: [
      {
        label: 'send message to emberMFE1',
        Icon: 'freshchat',
        onClick: (e) => {
          e.preventDefault();
          window.log('sending message to MFE emberMFE1 from App Shell', true);

          MFEController.namespace('embmfe').publish({
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
        label: 'change route in emberMFE1',
        Icon: 'forward',
        onClick: (e) => {
          e.preventDefault();
          window.log(
            'sending message to MFE emberMFE1 to change route from App Shell',
            true
          );

          MFEController.namespace('embmfe').publish({
            eventName: 'route_change_app_shell',
            action: {
              type: 'from_app_shell',
              sender: 'app shell',
            },
            payload: { to: 'route2' },
          });
        },
      },
    ],
  },
];
