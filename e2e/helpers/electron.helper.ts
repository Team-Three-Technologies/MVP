import { _electron as electron, ElectronApplication } from 'playwright';

export async function startApp() {
  const app = await electron.launch({
    args: [
      'dist/main/main/main.js',
      '--user-data-dir=./e2e/test-user-data', 
    ],
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORTABLE_EXECUTABLE_DIR: './e2e/fixtures/dip-sample', // appDir
    },
  });
  app.process().stdout?.on('data', (data) => console.log('[ELECTRON STDOUT]', data.toString()));
  app.process().stderr?.on('data', (data) => console.error('[ELECTRON STDERR]', data.toString()));
  const page = await app.firstWindow();
  return { app, page };
}
export async function runInMain(
  app: ElectronApplication, 
  fn: () => void
): Promise<void> {
  await app.evaluate(fn);
}
export async function stopApp(app: ElectronApplication) {
  await app.close();
}
