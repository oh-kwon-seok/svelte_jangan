<script>
	// @ts-nocheck
	import '../app.postcss';
	import { onMount,beforeUpdate, afterUpdate } from 'svelte';

	import {changeUrl,infoCallApi} from '$lib/store/common/function';
	import axios from 'axios';
	import Toast from '$lib/components/toast/Toast.svelte';
	import {common_toast_state} from '$lib/store/common/state';

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

	beforeUpdate(() => {
    // 현재 URL을 가져와 currentUrl 변수에 저장합니다.
        const url = window.location.href;
        const path = url.replace(/^(https?:\/\/)?[^\/]+/, '');
        const queryIndex = path.indexOf('?');
        
		const pathname = (queryIndex === -1) ? path : path.slice(0, queryIndex);
        const search = (queryIndex === -1) ? '' : path.slice(queryIndex);

		let url_obj = {path : pathname, query : search }
		changeUrl(url_obj);

		// 기준정보 select용 데이터들을 호출한다.

	
		infoCallApi('unit');
		infoCallApi('type');
		infoCallApi('standard');
		infoCallApi('origin');
		infoCallApi('car');
		infoCallApi('user');
		
		

	
	});
	
	onMount(() => {
		if (Kakao.isInitialized()) return; // 이미 초기화가 되어있다면 실행하지 않음
		
		Kakao.init('2713d0b777a1e2fbfaf1b0cd5aa224f4',{
			redirectUri: 'http://localhost:5173/home', // 콜백 URL 설정
  			persistAccessToken: true, // 액세스 토큰 지속 설정
		}); // 카카오 JS SDK를 초기화
		
	});


</script>


<div class='app '>
	<main>
		
		<slot />
	</main>

   

</div>
	
 