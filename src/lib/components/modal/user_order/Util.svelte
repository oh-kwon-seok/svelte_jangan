
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Img,Textarea} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {user_order_modal_state, user_order_form_state} from '$lib/store/user_order/state';
    import {common_alert_state, common_toast_state,common_car_state,table_state} from '$lib/store/common/state';

    import {fileButtonClick} from '$lib/store/common/function';
    
    import {save,userOrderSubTable,userTable,userOrderFileUpload,shipImageDownload,modalClose} from '$lib/store/user_order/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    
    import {onMount,afterUpdate } from 'svelte';
    export let title;





    let showModal = false;
    let imageUrl = '';

    function openModal() {
  
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }



  
    console.log('title',title);
    
    let label_title = '';
    let size = 'xl';
   
    if(title === 'add'){
      label_title = '추가';
    }else if(title === 'update'){
      label_title = '수정';
    }else if(title === 'delete'){
      label_title = '삭제';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }else if(title === 'print'){
      label_title = '출력';
    }

    let color;


    if(title === 'add' ||  title === 'update'){
      color = "blue";

    }else if(title === 'check_delete'){
      color = "red";

    }else{
      color = "light";

    }
    // let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 
    
    
    
    let tableComponent = "example-table-theme";
    let tableComponent1 = "example-table-theme1";
 

    onMount(()=>{
        if(title === 'add'){
          userTable(table_state,"user",tableComponent);
       
        }
      });

      afterUpdate(()=> {
        userTable(table_state,"user",tableComponent);
      
        if($user_order_form_state['user'] !== ''){
         
         
          userOrderSubTable(table_state,"user_order_sub_list",tableComponent1);
          
                      

        }
      })

  

    </script>

    <style>
      .modal {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        justify-content: center;
        align-items: center;
    }

      .modal img {
        max-width: 80%;
        max-height: 80%;
      }


    </style>

 

    <Modal title={`주문 ${label_title}`} permanent={true} color={color} {size} bind:open={$user_order_modal_state[title]['use']}  placement={'center'}   class="w-full">
       
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
    
         
         

          <Label class="space-y-2">
            <span>안내사항</span>
            <Input type="textarea"   id="last_name" placeholder="안내사항을 적어주세요" required bind:value={$user_order_form_state['description']}/>
          </Label>
          
          <Label class="space-y-2">
            <span>배송희망일자</span>
            <Input type="date"   id="last_name" placeholder="배송희망일자룰 입력하세요" required bind:value={$user_order_form_state['req_date']}/>
          </Label>


           
          {#if $user_order_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$user_order_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
            <Label class="space-y-2">
              <span>요청사항</span>
              <Textarea id="textarea-id" placeholder="요청사항이 있다면 입력해주세요" rows="4" name="message" bind:value={$user_order_form_state['req_des']}/>
            </Label>
          {/if}


          </div>
         
          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
                <p class="mb-4 font-semibold text-xl dark:text-white">주문 목록</p>
          </div>

           

          <div class="flex flex-row">
            <div id="example-table-theme1" bind:this={tableComponent1} />
            {#if $user_order_form_state['image_url'] !== "null" &&  $user_order_form_state['image_url'] !== "" && $user_order_modal_state['title'] === 'update'}
          
            

            <Img style="max-width: 100%; height : 40vh;" src={$user_order_form_state['image_url']} alt="sample 1" caption="사진 주문" on:click={()=>openModal()}/>
         

            {#if showModal}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="modal" on:click={closeModal}>
                <Img  src={$user_order_form_state['image_url']} alt="Zoomed Image" />
              </div>
            {/if}


            {/if}

          </div>

          <div class="mt-5">
        
            {#if $user_order_form_state['ship_image_url']}   
            <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
            <p class="mb-4 font-semibold text-xl dark:text-white">배송완료 사진</p>
           

            <!-- svelte-ignore missing-declaration -->


            <Img style="max-width: 100%; height : 40vh;" src={$user_order_form_state['ship_image_url']} alt="배송완료 사진" caption="배송완료 사진" on:click={()=>openModal()}/>
         

            {#if showModal}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="modal" on:click={closeModal}>
        
                <!-- svelte-ignore a11y-img-redundant-alt -->
           
                <Img src={$user_order_form_state['ship_image_url']} alt="배송완료 사진" caption="배송완료 사진" />
        
              </div>
            {/if}


            {/if}

          </div>

          {#if $user_order_modal_state['title'] === 'update'}
       
            <Button class="mt-5"  color='blue' on:click={(e)=> fileButtonClick('upload')}>
              <Icon.FileImageSolid class='mr-2' size="20" />
                배송완료 사진 등록
              <input 
              hidden  
              id = 'upload' 
              type='file' 
              accept="image/*"
              on:change={(e)=> userOrderFileUpload(e)}
              />
          </Button>

            {#if $user_order_form_state['ship_image_url']}   
              <Button id="download" class="mt-5"  color='blue' on:click={()=> shipImageDownload()}>
               이미지 다운로드
            </Button>
            {/if}
 
          {/if}
         
          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
              {#if title === 'check_delete'}
              <div>선택한 항목을 삭제하시겠습니까?</div>
              {:else if title === 'print'}
              <div>선택한 항목을 출력하시겠습니까?</div>
              
              {/if}
          {/if}
    
    
      
      
        </form>
      
        
        
        <svelte:fragment slot="footer">

        <Button  color={color}   class="w-1/2" on:click={save($user_order_form_state,title)}>{label_title}</Button>
        <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
       
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
              
        <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

        {/if}
        {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
              
        <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

        {/if}
        {#if $common_alert_state['type'] === 'print' && $common_alert_state['value'] === true}
              
        <Alert  state={'print'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['print'].title} content={DATA_FAIL_ALERT['print'].content} />

        {/if}
    
        </svelte:fragment>
  

      </Modal>

    