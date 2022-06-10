import { FwApplicationController as appController } from './business/FwApplicationController';
const FwApplicationController = new appController();
(window as any).FwApplicationController = FwApplicationController;
export { FwApplicationController };
