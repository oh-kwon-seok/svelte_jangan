
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {product_modal_state, product_form_state} from '$lib/store/product/state';

    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state} from '$lib/store/common/state';
    
    import {productSave,productModalClose} from '$lib/store/user/function';

    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT,TABLE_HEADER_LIST_FILTER} from '$lib/module/common/constants';
    
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


    let filteredCompanies = [];

    const handleTypeChange = (e) => {

      console.log('e : ',e.target.value);
      console.log('e1 : ',$common_company_state.filter(item => item.type['uid'] == e.target.value));

    // 선택한 type_uid에 해당하는 회사 필터링
      filteredCompanies = $common_company_state.filter(item => item.type['uid'] == e.target.value);
      $product_form_state['company'] = filteredCompanies[0]['uid'];

  }
  

    </script>

 

    <Modal title={`품목 ${label_title}`} permanent={true} color={color} bind:open={$product_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          <Label class="space-y-2">
            <span>분류</span>
            <Select id="countries" class="mt-2" bind:value={$product_form_state['type']} placeholder="" on:change={handleTypeChange}>
              
              
              
              {#each $common_type_state as item}
              <option value={item.uid}>{item.name}</option>
              {/each}
           
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
                {#each filteredCompanies as item}
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
   <svelte:fragment slot='footer'> 
    <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}  class="w-1/2" on:click={productSave($product_form_state,title)}>{label_title}</Button>
    <Button  color='red'  class="w-1/2" on:click={productModalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
          
    <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

    {/if}
        
      </svelte:fragment> 
       

      </Modal>

    