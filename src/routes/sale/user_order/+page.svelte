

<script>

	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/user_order/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {userOrderModalOpen} from '$lib/store/user_order/function';
    import {excelDownload, excelUpload, fileButtonClick} from '$lib/store/common/function';
    
    import {user_order_form_state,user_order_modal_state} from '$lib/store/user_order/state';

    import {url_state,cookie_state,common_user_order_state,table_state,common_toast_state,common_search_state,load_state} from '$lib/store/common/state';
    import {TABLE_COMPONENT,EXCEL_CONFIG} from '$lib/module/common/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {makeTable,infoCallApi} from '$lib/store/common/function';
    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';

  
	import moment from 'moment';
            
  
    export let data;

  let table_data;

    // @ts-ignore
    table_state.subscribe((item) => {
      table_data = item;
  });


 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점',$load_state);
       
        makeTable(table_state,"user_order",tableComponent);

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/sale/user_order'){
         
          makeTable(table_state,"user_order",tableComponent);
        }
      
    })
     
 

 

    </script>

<style>
  @import 'tabulator-tables/dist/css/tabulator_modern.min.css';

  /* 나머지 스타일 정의 */
</style>

    
        
        {#if $common_toast_state['value'] === true}
         <Toast />
        {/if}

        
     
        <Header />

        <div class="grid grid-rows-16 grid-flow-col gap-1">
            <div class="row-span-16"> 
              <SideBar />
            </div>
            <div class="col-span-1 row-span-1"> 
              <Title title='영업 관리' subtitle='주문 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">주문 관리</span>

                
                      <SearchBar title="user_order"/>


                      <div class='m-5'>

                        <Button  on:click={() => {userOrderModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => userOrderModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                        <Button  color='green' on:click={() =>excelDownload('user_order',EXCEL_CONFIG['user_order'])}>
                          <Icon.FileCsvSolid class='mr-2' size="20" />
                          엑셀다운
                      </Button>

                      <Button  color='light' on:click={() => userOrderModalOpen('','print')}>
                        <Icon.PrintSolid class='mr-2' size="20" />
                        주문서 출력
                    </Button>

                      

                        {#if $user_order_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $user_order_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $user_order_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                          {:else if $user_order_modal_state['title'] === 'print'}
                          <Util  title="print"/>
                        {/if}
                        

                      </div>

                      
                        <div id="example-table-theme" bind:this={tableComponent}></div>
                    
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    