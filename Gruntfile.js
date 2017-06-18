module.exports = function(grunt) {

	'use strict';

	//live reload
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var lrPort = 35729;
	var lrSnippet = require('connect-livereload')({ port: lrPort });
	var lrMiddleware = function(connect, options, middlwares) {
		return [
			lrSnippet,
			serveStatic(options.base[0]),
			serveIndex(options.base[0])
		];
	};

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// connect: {
		// 	server: {
		// 		options: {
		// 			port: 2020,
		// 			hostname: '*'
		// 		}
		// 	},
		// },
		connect: {
			options: {
				port: 2020,
				hostname: 'localhost',
				base: '.'
			},
			livereload: {
				options: {
					middleware: lrMiddleware
				}
			}
		},

		clean: {
        	dist: 'dist'
    	},

		uglify: {
			options: {
				stripBanners: true,
				banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/test.js',
				dest: 'build/<%=pkg.name%>-<%=pkg.version%>.js.min.js'
			}
		},

		cssmin: {
			options: {
				stripBanners: true,
				banner: '/*! <%=pkg.name%>-<%=pkg.version%>.css <%=grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/test.css',
				dest: 'build/<%=pkg.name%>-<%=pkg.version%>.css.min.css'
			}
		},

		jshint: {
			build: ['Gruntfile.js', 'src/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: ['src/*.css']
			},
			lax: {
				options: {
					import: false
				},
				src: ['src/*.css']
			}
		},
		
		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'scss',
					src: ['*.scss'],
					dest: 'dist/css',
					ext: '.css'
				}]
			}
		},

		watch:{
			build:{
				files:['index.html','src/*.js','src/*.css','scss/*.scss','dist/css/*.css'],
				tasks:['jshint','uglify','sass'],
				options:{
					livereload: lrPort,
					spawn:false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks("grunt-contrib-sass"); 
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('live', ['connect','clean:dist','jshint', 'uglify', 'csslint', 'cssmin', 'sass:dist', 'watch:build']);
};