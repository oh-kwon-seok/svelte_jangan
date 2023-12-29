

<script lang="ts">
    // @ts-nocheck
    import '../../app.postcss';
    

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    
    import SaleChart from './SaleChart.svelte';
    import { Tabs, TabItem, Timeline, TimelineItem, Button,Card,Dropdown,DropdownItem } from 'flowbite-svelte';

    import axios from 'axios';


    import NotFound from '$lib/components/error/404.svelte';

    import ServerError from '$lib/components/error/500.svelte';

    import { dashboard_state,url_state,cookie_state,common_product_state,table_state} from '$lib/store/common/state';
    import {makeTable,infoCallApi} from '$lib/store/common/function';
    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';
    import * as Icon from 'svelte-awesome-icons';
    import { writable } from 'svelte/store';
	import moment from 'moment';  
    export let data;
    const api = import.meta.env.VITE_API_BASE_URL;


    let dashboard_data ;

    dashboard_state.subscribe((data : any) => {
        dashboard_data = data;
    })

   
    onMount(()=>{
        
    const url = `${api}/user_order/info_select`; 
    console.log();

    const config = {
        headers:{
        "Content-Type": "application/json",
        
        }
    }

        axios.get(url,config).then(res=>{
    
    
        if(res.data.length > 0){
           
            let filtered_data = res.data.filter((item)=> {
                return item['order_status'] === "주문완료" && item['price_status'] === "수금완료";
            });


            dashboard_data['new_order_count'] = filtered_data.length;

            dashboard_state.update(()=> dashboard_data);


         console.log('res.data : ',res.data);
        

        }else {
        
        }
    })
  

       
        

    });
   
    afterUpdate(()=> {

     
       

    })

    </script>
    
    <style>
        @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
     
        /* 나머지 스타일 정의 */
      </style>
  
   


  <Header />

  <div class="grid grid-rows-16 grid-flow-col gap-1">
      <div class="row-span-16"> 
        <SideBar />
      </div>
      <div class="col-span-1 row-span-1"> 
        <Title title='HOME' subtitle='관리자 대시보드'/>
      </div>

    
      
      <div class="row-span-15 col-span-12 "> 
          <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
              <TabItem  open >
             

                <span slot="title">관리자 대시보드</span>

          
              

              
                <div class='m-5'>

                    <Card padding="sm ">
                      
                        <div class="flex flex-col items-center pb-4">
                    
                          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">신규 주문 건수</h5>
                         
                          <div class="flex justify-between items-center">
                            <span class="text-3xl font-bold text-gray-900 dark:text-white">{$dashboard_state['new_order_count']}</span>
                        
                          </div>
                        </div>
                      </Card>
                  
                    
                </div>

              


          
            

                
               
              
              </TabItem>
             
            
    
            </Tabs>
          <Footer />
      </div>
   
    </div>

     




       
       
        
        
    
    