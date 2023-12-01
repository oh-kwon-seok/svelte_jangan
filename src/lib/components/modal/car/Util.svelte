
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {car_modal_state, car_form_state} from '$lib/store/car/state';
    import {common_alert_state, common_toast_state,common_car_state } from '$lib/store/common/state';
    
    import {save} from '$lib/store/car/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    
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


  

    </script>

 

    <Modal title={`차량 ${label_title}`} color={color} bind:open={$car_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
         
          <Label class="space-y-2">
            <span>차량번호</span>
            <Input type="text" id="last_name" placeholder="차량번호를 입력하세요" required bind:value={$car_form_state['name']}/>
            
            {#if $car_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

    
          {#if $car_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$car_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
         

          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

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
    
        <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($car_form_state,title)}>{label_title}</Button>
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
     
        <div class="mt-12">
               <Alert  color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT[title].title} content={DATA_FAIL_ALERT[title].content}/>
           </div>
        {/if}

      </Modal>

    