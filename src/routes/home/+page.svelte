

<script lang="ts">
    // @ts-nocheck
    import '../../app.postcss';
    

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';


    
    import SaleChart from './SaleChart.svelte';
    import Temp from './sensor/Temp.svelte';
    import SpecialTemp from './sensor/SpecialTemp.svelte';
    import Humi from './sensor/Humi.svelte';
    
    import { Tabs, TabItem, Timeline, TimelineItem, Button,Card,Dropdown,DropdownItem } from 'flowbite-svelte';

    import axios from 'axios';


    import NotFound from '$lib/components/error/404.svelte';

    import ServerError from '$lib/components/error/500.svelte';

    import { dashboard_state,url_state,cookie_state,common_product_state,table_state} from '$lib/store/common/state';
    import {makeTable,infoCallApi} from '$lib/store/common/function';
    

	import { afterUpdate, onMount } from 'svelte';
  import {commaNumber} from '$lib/module/common/function';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';
    import * as Icon from 'svelte-awesome-icons';
    import { writable } from 'svelte/store';
	import moment from 'moment';  
    export let data;
    const api = import.meta.env.VITE_API_BASE_URL;


    let dashboard_data ;

    const select_query = (type:any,title:any) => {
   
   const url = `${api}/${type}/${title}_select`; 
         
   let basic_date = moment().subtract(90,'days');
   
 
   
   let start_date = basic_date.format('YYYY-MM-DDTHH:mm:ss');
   let end_date = basic_date.add(150,'days').format('YYYY-MM-DDTHH:mm:ss');
 
 
 
   let params = 
   {
     start_date : start_date,
     end_date  : end_date
   };
   const config = {
     params : params,
     headers:{
       "Content-Type": "application/json",
       
     }
   }
     axios.get(url,config).then(res=>{
      if(res.data.length > 0){
        
        
        if(title === 'temp'){
          
          let temp = res.data;
        
          let special_temp = res.data.filter((item:any) => item.data < -5 || item.data >5);
          


          dashboard_data['temp'] = temp;

          
          dashboard_data['special_temp'] = special_temp;
 



        }else{
          let data = res.data;
         

          dashboard_data['humi'] = data;
       
        }
        

        console.log(' dashboard_dat : ',  dashboard_data);
        console.log(' res_data : ',  res.data);
        dashboard_state.update(()=> dashboard_data);
      }
      
    })
   
 }





    dashboard_state.subscribe((data : any) => {
        dashboard_data = data;
    })

   
    onMount(()=>{
      select_query('sensor','temp');
      select_query('sensor','humi');
        
    const url = `${api}/user_order/info_select`; 
    const config = {
        headers:{
        "Content-Type": "application/json",
        
        }
    }

        axios.get(url,config).then(res=>{
    
    
        if(res.data.length > 0){
           
            let filtered_data = res.data.filter((item)=> {
                return item['order_status'] === "주문완료";
            });

            let filtered_cancel_data = res.data.filter((item)=> {
                return item['order_status'] === "주문취소";
            });
            let filtered_pay_data = res.data.filter((item)=> {
                return item['order_status'] !== "주문취소" && item['price_status'] === "수금완료";
            });


            dashboard_data['new_order_count'] = filtered_data.length;
            dashboard_data['cancel_order_count'] = filtered_cancel_data.length;
            dashboard_data['pay_count'] = filtered_pay_data.length;
        
            const total = filtered_pay_data.reduce((accumulator, currentValue) => {
              return accumulator + parseInt(currentValue.totalSupplyPrice);
            }, 0); 
            dashboard_data['supply_price'] =  total;

         


            dashboard_state.update(()=> dashboard_data);

       
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

          
              

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));  gap: 10px; ">
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
                <div class='m-5'>

                  <Card padding="sm ">
                    
                      <div class="flex flex-col items-center pb-4">
                  
                        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">취소건수</h5>
                       
                        <div class="flex justify-between items-center">
                          <span class="text-3xl font-bold text-gray-900 dark:text-white">{$dashboard_state['cancel_order_count']}</span>
                      
                        </div>
                      </div>
                    </Card>

            
              </div>
              <div class='m-5'>

                <Card padding="sm ">
                  
                    <div class="flex flex-col items-center pb-4">
                
                      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">결제건수</h5>
                     
                      <div class="flex justify-between items-center">
                        <span class="text-3xl font-bold text-gray-900 dark:text-white">{$dashboard_state['pay_count']}</span>
                    
                      </div>
                    </div>
                  </Card>

          
            </div>

            <div class='m-5'>

              <Card padding="sm ">
                
                  <div class="flex flex-col items-center pb-4">
              
                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">결제자수</h5>
                   
                    <div class="flex justify-between items-center">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">{$dashboard_state['pay_count']}</span>
                  
                    </div>
                  </div>
                </Card>

        
          </div>

            <div class='m-5'>

              <Card padding="sm ">
                
                  <div class="flex flex-col items-center pb-4">
              
                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">결제금액</h5>
                   
                    <div class="flex justify-between items-center">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">{commaNumber($dashboard_state['supply_price'])}</span>
                  
                    </div>
                  </div>
                </Card>

        
          </div>
        

        </div>
      
      
       
               
              
              </TabItem>
           
          
            </Tabs>
            {#if dashboard_data['humi'].length > 0 && dashboard_data['temp'].length > 0}
            <div class="flex flex-row m-8"> 
            
              <div class="w-2/6 m-8">
              
                <Temp dashboard_data={dashboard_data}/>
              </div>
              <div class="w-2/6 m-8">
                <Humi dashboard_data={dashboard_data}/>
              </div>
              <div class="w-2/6 m-8">
                <SpecialTemp dashboard_data={dashboard_data}/>
              </div>

              <!-- <SaleChart dashboard_data={dashboard_data}/> -->
              
            
              <!-- <Temp dashboard_data={dashboard_data}/> -->
              

              
           
          </div>   
         
          {/if}
           

          <Footer />
            
        

        </div>
   
    </div>

     




       
       
        
        
    
    