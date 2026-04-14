import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { setupElectronApiMock } from './app/mocks/electron-api.mock';

// Setup mock for local development and testing purposes
setupElectronApiMock();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
