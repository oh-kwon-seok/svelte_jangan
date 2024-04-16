

<script lang="ts">
	
	import { Button, Label, Input, Checkbox, Card, Spinner,Helper} from 'flowbite-svelte'
	import axios from 'axios'
	import Alert from '$lib/components/alert/Alert.svelte';
	import Loading from '$lib/components/button/Loading.svelte';
	
	import {LOGIN_ALERT} from '$lib/module/common/constants';

	import {passwordCheck} from '$lib/module/common/function';
	
	import login_url from '$lib/images/login_url.jpg';
	import bg_url from '$lib/images/main_bg.jpg';

	import {common_alert_state,login_state, load_state} from '$lib/store/common/state';

	import {onChangeHandler,loadChange,tokenChange} from '$lib/store/common/function';


	import { setCookie, getCookie, removeCookie } from '$lib/cookies';

	import { onMount } from 'svelte';
	const api = import.meta.env.VITE_API_BASE_URL;
	
	
	let autoSave : any = false; // 자동저장유무

	let test_style= `background-image: url('${bg_url}');`


	onMount(async () => {
		
		const storedUsername = getCookie('my-cookie');
		const storedPassword = getCookie('password');
		const storedAutoSave = getCookie('autoSave');
		
	
		if(storedUsername){
			$login_state['id'] = storedUsername;
		}
		if(storedPassword){
			$login_state['password'] = storedPassword;
		}
		if(storedAutoSave){
			autoSave = storedAutoSave === 'true'; // 쿠키는 문자열로 저장되므로 boolean으로 변환
		}
	
  	});



	const login = async(e : any) => {
		loadChange(true);
		$common_alert_state = {type : 'login', value : false};
		
	
		const url = `${api}/user/sign-in`

		try {
			await performAsyncTask();

			let params = $login_state;

		
				const config = {
				headers:{
					"Content-Type": "application/json",
					
				}
			}


		await axios.post(url,
			params,config
		).then(res => {
		

		
			if(res.data['success'] === true){
					// 	// 쿠키 설정

				setCookie('my-cookie', $login_state['id'], { expires: 3600 });
				if(autoSave === true){
					setCookie('my-cookie', $login_state['id'], { expires: 21 * 24 * 60 * 60  });
					setCookie('password', $login_state['password'], { expires: 21 * 24 * 60 * 60  });
					setCookie('autoSave', autoSave, { expires: 21 * 24 * 60 * 60 }); // 21일 보관

				}
				
				tokenChange(res.data['token']);

		
				window.location.href = '/sale/user_order';
			
			}else if(res.data['success'] === false){
				
				
				
				$common_alert_state = {type : 'login', value : true};
			}		
		}
			
	)
		
		}catch (e : any){
			alert(`다음과 같은 에러가 발생했습니다 : ${e.name} : ${e.message}`);
		} finally {
			loadChange(false);
			
		}

	}



	const performAsyncTask = () => {
    return new Promise((resolve : any, reject : any) => {
      // 비동기 작업을 수행하는 함수를 정의합니다.
      // 실제 작업을 수행하는 로직을 여기에 추가합니다.
      // 예시로 2초 후에 작업이 완료되었다고 가정합니다.
      setTimeout(() => {
        // 비동기 작업이 완료되면 resolve를 호출하여 성공을 알립니다.
        resolve();
        // 예시로 강제로 예외를 발생시킵니다.
        // reject(new Error("비동기 작업 중 예외 발생"));
      }, 2000);
    });
  }








	
  

</script>	

		
		<div class="flex justify-center items-center h-screen bg-cover" style={test_style}>
		<!-- <Card  size="xl"  img={login_url}   reverse={false} horizontal>	 -->
		<Card  size="md"  img={login_url}   reverse={false} >	

		<form class="flex flex-col space-y-6" >
				<h3 class="text-xl font-medium text-gray-700 dark:text-white p-0 w-80">신선식품 유통 서비스</h3>
				<Label class="space-y-2">
					<span>ID</span>
					<Input  type="text" name="id" placeholder="ID를 입력하세요" required bind:value={$login_state.id} />
				</Label>
				<Label class="space-y-2 justify-center">
					<span>Password</span>
					<Input  type="password" name="password" placeholder="•••••" required bind:value={$login_state.password} />
					
					{#if $common_alert_state['type'] === 'login' && $common_alert_state['value'] === true}
						{#if  $login_state['password'] !== '' && passwordCheck($login_state['password']) === false}
						<Helper class='mt-2' color='red'><span class="font-medium">비밀번호는 숫자,문자,특수문자포함 8글자 이상이어야 합니다.</span></Helper>
						{/if}
					{/if}
				</Label>
				<div class="flex items-start">
					<Checkbox bind:checked={autoSave}>자동 저장</Checkbox>
					
				</div>
				{#if $load_state === false}
					<Button  type="submit" class="w-full" on:click={(e) => login(e)} >로그인</Button>
				{:else if $load_state === true}
					<Loading />
				{/if}

				
			</form>
		{#if $common_alert_state['type'] === 'login' && $common_alert_state['value'] === true}
			<div class="mt-12">
				<Alert state={'login'} color='red' title={LOGIN_ALERT.title} content={LOGIN_ALERT.content} />
			</div>
		{/if}


	</Card>
</div>




	








