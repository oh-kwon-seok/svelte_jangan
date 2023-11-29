
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {user_modal_state, user_form_state} from '$lib/store/user/state';
    import {common_alert_state, common_toast_state,common_type_state, common_unit_state, common_origin_state,common_standard_state,common_car_state,table_state} from '$lib/store/common/state';
    
    import {save,userProductTable} from '$lib/store/user/function';

    
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {businessNumber,phoneNumber,validEmail} from '$lib/module/common/function';
    
    import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

    import {onMount,afterUpdate } from 'svelte';
    export let title;


    let show = false; // 비밀번호용
  
  
    console.log('title',title);
    
    let label_title = '';
   
   
    if(title === 'add'){
      label_title = '추가';
    }else if(title === 'update'){
      label_title = '수정';
    }else if(title === 'delete'){
      label_title = '삭제';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }

    let color = title === 'add' || title === 'update'   ? 'blue' : 'red'; 

    let tableComponent = "example-table-theme";


      onMount(()=>{
        userProductTable(table_state,"user_product",tableComponent);
      });

      afterUpdate(()=> {
        userProductTable(table_state,"user_product",tableComponent);
  
      })

    </script>

 

    <Modal title={`회원 ${label_title}`} color={color} bind:open={$user_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          
          {#if $user_modal_state['title'] === 'add'}
          <Label class="space-y-2">
            <span>사업자번호 {businessNumber($user_form_state.code)}</span>
            <Input maxlength="10" type="text" placeholder="사업자번호를 입력하세요" required bind:value={$user_form_state['code']} on:input={businessNumber($user_form_state.code)}/>
            
            {#if $user_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          {/if}


          <Label class="space-y-2">
            <span>상호</span>
            <Input type="text" id="customer_name" placeholder="상호를 입력하세요" required bind:value={$user_form_state['customer_name']}/>
            
            {#if $user_form_state['customer_name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

          <Label class="space-y-2">
            <span>대표자</span>
            <Input type="text" id="name" placeholder="대표자를 입력하세요" required bind:value={$user_form_state['name']}/>
            
            {#if $user_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

          

          <!-- 사업장 ID는 사업자등록번호로 연결시켜놓음 -->
          {#if $user_modal_state['title'] === 'add'}
          <Label class="space-y-2"> 
            <span>ID</span>
            <Input type="text" id="id" readOnly placeholder="ID를 입력하세요" required bind:value={$user_form_state['code']}/>

            {#if $user_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          {/if}

              <!-- 사업장 ID는 사업자등록번호로 연결시켜놓음 -->
              
              {#if $user_modal_state['title'] === 'add'}
              <Label class="space-y-2"> 
                <span>비밀번호</span>
                <Input id="show-password" type={show ? 'text' : 'password'} placeholder="비밀번호를 입력하세요"  bind:value={$user_form_state['password']}>
                  <button slot="left" on:click={() => (show = !show)} class="pointer-events-auto">
                    {#if show}
                      <!-- svelte-ignore missing-declaration -->
                      <EyeOutline class="w-6 h-6" />
                    {:else}
                      <EyeSlashOutline class="w-6 h-6" />
                    {/if}
                  </button>
                </Input>
                {#if $user_form_state['code'] === '' && $common_alert_state['value'] === true}
                <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
                {/if}
              </Label>
              {/if}

              <Label class="space-y-2">
                <span>연락처 {phoneNumber($user_form_state.phone)}</span>
                <Input maxlength="11" type="text" placeholder="연락처를 입력하세요" required bind:value={$user_form_state['phone']} on:input={phoneNumber($user_form_state.phone)}/>
              </Label>
              <Label class="space-y-2">
                <span>이메일 {validEmail($user_form_state.email) ? 'OK' : '형식이 맞지 않습니다.'}</span>
                <Input maxlength="50" type="text" placeholder="이메일을 입력하세요" required bind:value={$user_form_state['email']} on:input={validEmail($user_form_state.email)}/>
              </Label>



          <Label class="space-y-2">
            <span>지정차량</span>
            <Select id="countrie" class="mt-2" bind:value={$user_form_state['car']} placeholder="">
                {#each $common_car_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>
       

          

          {#if $user_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$user_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
         

          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
                <p class="mb-4 font-semibold text-xl dark:text-white">취급품목</p>
          </div>

        

            <div id="example-table-theme" bind:this={tableComponent}></div>
         
        
       


<!-- 
          <div class="grid grid-cols-6 gap-4">
            <P class="col-span-3 text-bold" align='center'>BOM 리스트</P>
            <Button color="blue" class="gap-4" on:click={() => bomRowUtil('add')}>
              행추가
              
              
              <Indicator color="none" class="bg-red-500 text-xs text-primary-800 font-semibold" size="lg">{$info_item_form_state['child'].length > 0 ? $info_item_form_state['child'].length : 0}</Indicator>
            
            </Button>
            <Button color="red" class="gap-4" on:click={() => bomRowUtil('check_delete')}>
              선택삭제
             </Button>
             <Button color="red" class="gap-4" on:click={() => bomRowUtil('delete')}>
              행삭제
             </Button>
          </div> -->



          <!-- {#if $common_toast_state['value'] === true}
          <Toast />
         {/if} -->

         {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
            
         <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

       {/if}
       
        
          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
              {#if title === 'delete'}
              <div>삭제하시겠습니까?</div>
              {:else }
              <div>선택한 항목을 삭제하시겠습니까?</div>
              
              {/if}
          {/if}
    
        
      
      
        </form>
        <!-- <svelte:fragment slot='footer'>
          <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($user_form_state,title)}>{label_title}</Button>
       
          
        
        </svelte:fragment> -->
        <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($user_form_state,title)}>{label_title}</Button>
       
       
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
     
        
        <!-- <div class="mt-12">
               <Alert  color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT[title].title} content={DATA_FAIL_ALERT[title].content}/>
           </div> -->
        {/if}

      </Modal>

    