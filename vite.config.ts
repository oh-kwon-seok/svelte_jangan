import { sveltekit } from '@sveltejs/kit/vite';
import  { defineConfig } from 'vite';
import removeConsole from "vite-plugin-remove-console";
export default defineConfig({
	
	// build: {
	// 	rollupOptions: {
	// 	  // 외부 모듈을 번들링합니다.
	// 	  external: ['tabulator-tables-css'],
	
	// 	  // 번들에 포함할 모듈의 경로를 설정합니다.
	// 	  output: {
	// 		globals: {
	// 		  'tabulator-tables-css': 'Tabulator', // 모듈 이름과 전역 변수 이름을 설정합니다.
	// 		},
	// 	  },
	// 	},
	//   },
	//   resolve: {
	// 	alias: {
	// 	  // 사용할 모듈의 별칭을 설정합니다.
	// 	  'tabulator-tables-css': 'tabulator-tables/dist/css/tabulator_modern.min.css',
		
		  
	// 	},
	//   },

	plugins: [sveltekit()],
  
	server: {
		port : 3001,
	  proxy: {
		'/api': {
		  target: 'http://localhost:8081',
		  changeOrigin: true,
		  rewrite: (path) => path.replace(/^\/api/, ''),
		},
	  },
	},
	preview: {
		port: 3001, 
	},

  });