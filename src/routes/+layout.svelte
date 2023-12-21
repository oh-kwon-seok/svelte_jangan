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

		
		infoCallApi('company');
		infoCallApi('car');
		infoCallApi('user');
		
		

	
	});
	
	


</script>


<div class='app '>
	<main>
		
		<slot />
	</main>

   

</div>
	
 