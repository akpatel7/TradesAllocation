basePath = '../';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    REQUIRE,
    REQUIRE_ADAPTER,
    { pattern: 'Specs/unit/main-test.js', included: true },
    { pattern: 'Lib/**/*.js', included: false, watched: false },
    { pattern: 'Specs/lib/**/*.js', included: false },
    { pattern: 'App/**/*.js', included: false },
    { pattern: 'Masonry/**/*.js', included: false },
    { pattern: 'Specs/unit/**/*.js', included: false },
    { pattern: 'Lib/TreeGrid/*.xml', included: false },
    { pattern: 'Lib/TreeGrid/Standard/Grid.css', included: false }
];

// list of files to exclude
exclude = [
];

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = [
  'Chrome'
];

// test results reporter to use
// possible values: dots || progress
reporter = 'progress';

// web server port
port = 9018;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

captureTimeout = 120000;

