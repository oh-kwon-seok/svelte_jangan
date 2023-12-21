

<script lang="ts">
	
	import { Button, Label, Input, Checkbox, Card, Spinner} from 'flowbite-svelte'
	import axios from 'axios'
	import Alert from '$lib/components/alert/Alert.svelte';
	import Loading from '$lib/components/button/Loading.svelte';
	
	import {LOGIN_ALERT} from '$lib/module/common/constants';
	import src_url from '$lib/images/sea.jpeg';
	import {common_alert_state,login_state, load_state} from '$lib/store/common/state';

	import {onChangeHandler,loadChange,tokenChange} from '$lib/store/common/function';


	import { setCookie, getCookie, removeCookie } from '$lib/cookies';
	import naver from 'naver-id-login'

	import naver_login_button from '$lib/images/naver_login_white.png';
	import { onMount } from 'svelte';


	const login = async(e : any) => {
		loadChange(true);
		$common_alert_state = {type : 'login', value : false};
		
	
		const url = `http://localhost:8081/user/sign-in`

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
				tokenChange(res.data['token']);

		
				window.location.href = '/home';
			
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
		
		<div class="flex justify-center items-center ">
		<Card class="w-full mt-16 "  padding='xl' img={src_url}   reverse={false} horizontal>	
		<form class="flex flex-col space-y-6" >
				<h3 class="text-xl font-medium text-gray-700 dark:text-white p-0 w-80">장안유통 식자재유통서비스</h3>
				<Label class="space-y-2">
					<span>ID</span>
					<Input   type="text" name="id" placeholder="ID를 입력하세요" required vind:value={$login_state.id} on:change={(e)=> onChangeHandler(e)} />
				</Label>
				<Label class="space-y-2 justify-center">
					<span>Password</span>
					<Input  type="password" name="password" placeholder="•••••" required vind:value={$login_state.password} on:change={(e)=> onChangeHandler(e)}/>
				</Label>
				<div class="flex items-start">
					<Checkbox>자동 저장</Checkbox>
					
				</div>
				{#if $load_state === false}
					<Button  type="submit" class="w-full" on:click={(e) => login(e)} >Login</Button>
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




	








