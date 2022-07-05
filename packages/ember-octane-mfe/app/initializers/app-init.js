import { MFEInstance } from '../controller';
export function initialize(application) {
  console.log('ibnit calling ', application);

  MFEInstance.subscribe('from_app_shell', (msg) => {
    window.log(
      `Message received for instance - from app shell <pre>${JSON.stringify(
        msg,
        null,
        2
      )}</pre>`
    );
  });

  MFEInstance.subscribe('route_change_app_shell', (msg) => {
    console.info(`${msg}`);
    window.log(
      `Routing Message received from app shell <pre>${JSON.stringify(
        msg,
        null,
        2
      )}</pre>`
    );
    window.log(`Navigation to route ${msg.payload.to}`);
    // eslint-disable-next-line ember/no-private-routing-service
    application.__container__
      .lookup('router:main')
      .transitionTo(msg.payload.to);
  });
}

export default {
  initialize,
};
