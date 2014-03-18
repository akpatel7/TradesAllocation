module.exports = function (grunt) {
    grunt.initConfig({
        meta: {
            src: 'App/**/*.js',
            specs: 'Specs/unit/**/*.spec.js',
            vendor: ['Lib/angular/*.js', 'Lib/jquery/jquery.js'],
            bin: {
                coverage: 'bin/coverage'
            },
            less: '../Content/less/**/*.less'
            
        },
        watch: {
            dev: {
                files: ['<%= meta.src %>', '<%= meta.specs %>'],
                tasks: ['jshint', 'karma:unit']
            },
            ui: {
                files: ['<%= meta.less %>'],
                tasks: ['less:dev']
            }
        },
       
        less: {
            teamcity: {
                options: {
                    paths: ['../Content/less'],
                    cleancss: true
                    //yuicompress: false
                },
                files: [
                    { '../Content/css/bootstrap-dashboard.css': '../Content/less/bootstrap-dashboard.less' }
                ]
            },
            dev: {
                // https://npmjs.org/package/grunt-contrib-less
                options: {
                    paths: ['../Content/less'],
                    sourceMapRootpath: '/',
                    sourceMap: true
                },
                files: [
                    { '../Content/css/bootstrap-dashboard.css': '../Content/less/bootstrap-dashboard.less' }
                ]
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                laxcomma: false,
                //es3: true,
                globals: {
                    require: true,
                    define: true,
                    requirejs: true,
                    describe: true,
                    expect: true,
                    it: true,
                    beforeEach: true,
                    afterEach: true,
                    jasmine: true,
                    angular: true,
                    module: true,
                    inject: true,
                    gapi: true,
                    spyOn: true,
                    $: false,
                    Tracking: true,
                    Highcharts: true,
                    waitsFor: true,
                    runs: true,
                    Grids: true
                }
            },
			local: {
				src: ['GruntFile.js', '<%= meta.src %>', '<%= meta.specs %>'],
				options: { }
			},
			teamcity: {
				src: ['GruntFile.js', '<%= meta.src %>', '<%= meta.specs %>']
				
			}
        },
        html2js: {
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.'
                },
                files: [{
                    expand: true,
                    src: ['Lib/**/*.html'],
                    ext: '.html.js'
                }]
            }
        },
        karma: {
            unit: {
                options: {
                    configFile: 'Specs/karma.conf.js',
                    browsers: ['Chrome'],
                    autoWatch: true
                }
            },
            'unit-ie': {
                options: {
                    configFile: 'Specs/karma.conf.js',
                    browsers: ['IE'],
                    autoWatch: true
                }
            },
            continuous: {
                configFile: 'Specs/karma.conf.js',
                browsers: ['Chrome', 'IE'],
                reporters: ['teamcity', 'coverage'],
                singleRun: true,
                preprocessors: {
                    'App/**/*.js': 'coverage'
                }
            },
            'continuous-ie': {
                configFile: 'Specs/karma.conf.js',
                browsers: ['IE'],
                reporters: ['teamcity', 'coverage'],
                singleRun: true,
                preprocessors: {
                    'App/**/*.js': 'coverage'
                }
            },
            'continuous-chrome': {
                    configFile: 'Specs/karma.conf.js',
                    browsers: ['Chrome'],
                    reporters: ['teamcity', 'coverage'],
                    singleRun: true,
                    preprocessors: {
                        'App/**/*.js': 'coverage'
                    }
                },
            local: {
                configFile: 'Specs/karma.conf.js',
                browsers: ['Chrome'],
                reporters: ['progress', 'coverage'],
				preprocessors: {
                    'App/**/*.js': 'coverage'
                },
                singleRun: true
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './',
                    mainConfigFile: 'main.js',
                    dir: '../Scripts-Build',
                    fileExclusionRegExp: 'node_modules|Specs|docs',
                    skipDirOptimize: false,
                    optimize: 'uglify2',
                    skipModuleInsertion: false,
                    uglify2: {
                        output: {
                            beautify: false
                        },
                        mangle: false
                    },
                    preserveLicenseComments: true,
                    modules: [
                        {
                            name: 'main',
                            include: ['jquery', 'jquery-ui'],
                            excludeShallow: [
                                'TreeGrid'
                            ]
                        },
                        {
                            name: 'TreeGrid'
                        }
                    ]
                }
            }
        }
        
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    
    // Default task.
    grunt.registerTask('default', ['jshint:local']);
    grunt.registerTask('test', ['jshint:local', 'karma:unit']);
    grunt.registerTask('test-ie', ['jshint:local', 'karma:unit-ie']);
    grunt.registerTask('teamcity', ['jshint:teamcity', 'karma:continuous']);
    grunt.registerTask('teamcity-chrome', ['jshint:teamcity', 'karma:continuous-chrome']);
    grunt.registerTask('teamcity-ie', ['jshint:teamcity', 'karma:continuous-ie']);
    grunt.registerTask('local', ['jshint:local', 'karma:local']);
};