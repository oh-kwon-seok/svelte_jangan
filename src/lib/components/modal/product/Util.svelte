
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {product_modal_state, product_form_state} from '$lib/store/product/state';
    import {common_alert_state, common_toast_state,common_company_state} from '$lib/store/common/state';
    
    import {save} from '$lib/store/product/function';
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

 

    <Modal title={`품목 ${label_title}`} color={color} bind:open={$product_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          <Label class="space-y-2">
            <span>분류</span>
            <Select id="countries" class="mt-2" bind:value={$product_form_state['type']} placeholder="">
              <option value={"채소류"}>{"채소류"}</option>
              <option value={"김치"}>{"김치"}</option>
              <option value={"수산물"}>{"수산물"}</option>
              <option value={"육류"}>{"육류"}</option>
              <option value={"젓갈"}>{"젓갈"}</option>
              <option value={"건어물"}>{"건어물"}</option>
              <option value={"냉동"}>{"냉동"}</option>
              <option value={"일회용품"}>{"일회용품"}</option>
              <option value={"공산품"}>{"공산품"}</option>
              <option value={"기타"}>{"기타"}</option>
              
              
          </Select>
          </Label>
          <Label class="space-y-2">
            <span>품명</span>
            <Input type="text" id="last_name" placeholder="품명을 입력하세요" required bind:value={$product_form_state['name']}/>
            
            {#if $product_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

      
          <Label class="space-y-2">
            <span>매입처</span>
            <Select id="countrie" class="mt-2" bind:value={$product_form_state['company']} placeholder="">
                {#each $common_company_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>
    
        
          {#if $product_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$product_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
         

          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>
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
          <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($product_form_state,title)}>{label_title}</Button>
       
          
        
        </svelte:fragment> -->
        <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($product_form_state,title)}>{label_title}</Button>
       
       
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
     
        
        <!-- <div class="mt-12">
               <Alert  color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT[title].title} content={DATA_FAIL_ALERT[title].content}/>
           </div> -->
        {/if}

      </Modal>

    