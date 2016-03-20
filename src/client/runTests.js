import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine';
import initJasmineJquery from './jasmine-jquery';
import JasmineInterface from '../lib/JasmineInterface';
import VelocityTestReporter from '../lib/VelocityTestReporter';

export default function runTests(testCodeBlocks) {
  const name = 'jasmine-client';
  const jasmine = jasmineRequire.core(jasmineRequire)
  const jasmineInterface = new JasmineInterface({jasmine})
  _.extend(global, jasmineInterface)
  initJasmineJquery();

  // Setting up timing functions to be able to be overridden.
  // Certain browsers (Safari, IE 8, phantomjs) require this hack.
  window.setTimeout = window.setTimeout
  window.setInterval = window.setInterval
  window.clearTimeout = window.clearTimeout
  window.clearInterval = window.clearInterval

  const ddpConnection = Meteor
  ddpConnection.call('velocity/reports/reset', {framework: name})

  const env = jasmine.getEnv()

  const velocityReporter = new VelocityTestReporter({
    mode: 'client',
    framework: name,
    env,
    timer: new jasmine.Timer(),
    ddpConnection,
    isClient: true
  })
  env.addReporter(velocityReporter)

  _.forEach(testCodeBlocks, function (callback) {
    callback()
  })

  env.execute()
}
