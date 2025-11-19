export function overrideConsoleLog(): void {
  // override console methods to add a prefix to all logs
  const log = console.log;
  console.log = function (...args): void {
    log('📚 LOG:', ...args);
  };

  const error = console.error;
  console.error = function (...args): void {
    error('📕 ERROR:', ...args);
  };

  const warn = console.warn;
  console.warn = function (...args): void {
    warn('📙 WARN:', ...args);
  };

  const info = console.info;
  console.info = function (...args): void {
    info('📘 INFO:', ...args);
  };
}
