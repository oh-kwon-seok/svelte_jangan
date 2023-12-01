
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {user_order_modal_state, user_order_form_state} from '$lib/store/user_order/state';
    import {common_alert_state, common_toast_state,common_car_state,table_state} from '$lib/store/common/state';
    
    import {save,userOrderSubTable,userTable} from '$lib/store/user_order/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    
    import {onMount,afterUpdate } from 'svelte';
    export let title;



  
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

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 
    let tableComponent = "example-table-theme";
    let tableComponent1 = "example-table-theme1";

    onMount(()=>{
        
      userTable(table_state,"user",tableComponent);

   
      });

      afterUpdate(()=> {
        userTable(table_state,"user",tableComponent);
      
        if($user_order_form_state['user'] !== ''){
         
          userOrderSubTable(table_state,"user_order_sub",tableComponent1);
        }
      })

  

    </script>

 

    <Modal title={`주문 ${label_title}`} color={color} bind:open={$user_order_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
          

          {#if title==='add'}
            <div id="example-table-theme" bind:this={tableComponent}></div>
          {/if}
         



          <div class="grid grid-cols-2 gap-4">
     

        
         
       
          <Label class="space-y-2">
            <span>계정</span>
            <Input type="text" readOnly  id="last_name" placeholder="업체룰 선택하세요" required bind:value={$user_order_form_state['user']}/>
            
            {#if $user_order_form_state['user'] === '' && $common_alert_state['user'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">업체를 선택해주세요</span></Helper>
            {/if}
          </Label>

          <Label class="space-y-2">
            <span>지정차량</span>

            <Select id="countrie" class="mt-2" bind:value={$user_order_form_state['car']} placeholder="">
              
              
                {#each $common_car_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>

          <Label class="space-y-2">
            <span>주문상태</span>
            <Select id="countrie" class="mt-2" bind:value={$user_order_form_state['order_status']} placeholder="">
              
              
                  <option value={'주문완료'}>주문완료</option>
                  <option value={'주문확인'}>주문확인</option>
                  <option value={'주문취소'}>주문취소</option>
                  <option value={'납품완료'}>납품완료</option>
                  
               
              </Select>
          </Label>

          
          <Label class="space-y-2">
            <span>수금 상태</span>
            <Select id="countrie" class="mt-2" bind:value={$user_order_form_state['price_status']} placeholder="">
              
                  <option value={'미수금'}>미수금</option>
                  <option value={'부분수금'}>부분수금</option>
                  <option value={'수금완료'}>수금완료</option>
              
              </Select>
          </Label>
    
         
          
          {#if $user_order_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$user_order_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
         

          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
                <p class="mb-4 font-semibold text-xl dark:text-white">주문 목록</p>
          </div>

         

          <div id="example-table-theme1" bind:this={tableComponent1}></div>



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
          <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($user_order_form_state,title)}>{label_title}</Button>
       
          
        
        </svelte:fragment> -->
        <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($user_order_form_state,title)}>{label_title}</Button>
       
       
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
     
        
        <!-- <div class="mt-12">
               <Alert  color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT[title].title} content={DATA_FAIL_ALERT[title].content}/>
           </div> -->
        {/if}

      </Modal>

    