

<script lang="ts">
    // @ts-nocheck
    import '../../app.postcss';
    

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    
    import SaleChart from './SaleChart.svelte';
    import { Tabs, TabItem, Timeline, TimelineItem, Button } from 'flowbite-svelte';




    import NotFound from '$lib/components/error/404.svelte';

    import ServerError from '$lib/components/error/500.svelte';

    import {url_state,cookie_state,common_product_state,table_state} from '$lib/store/common/state';
    import {makeTable,infoCallApi} from '$lib/store/common/function';
    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';
    import * as Icon from 'svelte-awesome-icons';
    
	import moment from 'moment';

  
    export let data;
  


    let status;
  
    let tableComponent = "example-table-theme";
    

   
    onMount(()=>{
        console.log('시점');
       
        makeTable(table_state,"product",tableComponent);

    });
   
    afterUpdate(()=> {

        if(data.title === 'redirect'){
            console.log('cookie_state',cookie_state);
            console.log('data : ', data);
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/home'){
            status = 'on';
          
            
        }
        console.log('status : ', status);

    })

    </script>
    
    <style>
        @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
     
        /* 나머지 스타일 정의 */
      </style>
  
   


        <Header />
      
        <div class="grid grid-rows-1 grid-flow-col gap-2">
            <div class="row-span-3 "> <SideBar />
              
    
            </div>
          
            
            
            
            <div class="col-span-1 ">
               

                <Tabs style="full" defaultClass="mt-5 flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700">
                    <TabItem class="w-full" open>
                    <span slot="title">매출현황</span>
                    <p class="text-sm text-gray-500 dark:text-gray-400"><b>매출현황:</b> 전년대비 금년도 매출현황입니다.</p>
                        <!-- <SaleChart /> -->
                     

                    </TabItem>
                   

                    <TabItem class="w-full" >
                        <span slot="title">생산현황</span>
                        <p class="text-sm text-gray-500 dark:text-gray-400"><b>생산현황:</b>현재 생산현황입니다.</p>
                        <SaleChart />
                    </TabItem>
                    <TabItem class="w-full" >
                        <span slot="title">출하현황</span>
                        <p class="text-sm text-gray-500 dark:text-gray-400"><b>출하현황:</b>현재 출하현황입니다.</p>
                        <SaleChart />
                    </TabItem>
                </Tabs>
               
                <Footer />
            </div>


        

          
       
                
      </div>

     




       
       
        
        
    
    