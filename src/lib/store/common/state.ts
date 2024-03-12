

import { writable } from 'svelte/store';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';




const menu_state = writable({
  home : false,
  info : false,
  project : false,
  process_equipment : false,
  product : false,
  shipment : false,

});






const cookie_state = getCookie('my-cookie');
const load_state = writable(false);

const url_state : any = writable({ path : '', query : ''});


  const common_alert_state : any = writable({type : 'save', value : false });

  const common_toast_state : any = writable({type : 'success', value : false, counter : 4 });

  const common_search_state : any = writable({
    start_date : moment().subtract(1, "year").format('YYYY-MM-DD'),
    end_date : moment().add(1, "day").format('YYYY-MM-DD'),
    search_text : '',
    filter : [],
    filter_title : "all",
  });


  const dashboard_state : any = writable({
    new_order_count : 0,
    cancel_order_count : 0,
    pay_count : 0,
    supply_price : 0,
    humi : [],
    temp : [],  
    temp_date : [],
    humi_date : [],

    special_temp : [],
    special_humi : [],
    
    special_temp_date : [],
    special_humi_date : [],

    
  });

  

  const login_state : any = writable({
    user_idx : "",
    id : "",
    name : "",
    password : "",
    token :"",

    status : false,
    
  });


  const table_state : any = writable({
    product : "",
    car : "",
    type : "",
    company : "",
    user : "",
    user_product : "",
    user_product_list : "", // 즐겨찾기 목록
    user_order : "",
    user_list : "",
    user_order_sub : "",
    user_order_sub_list : "",
    user_order_sub_list2 : "",
    
    
  });
  
  const table_real_state : any = writable({ // 원본데이터
    
    user_product : "",
    user_product_list : "",
    user_order : "",
    user_order_sub : "",
    user_order_sub_list : "", // 주문목록 리스트
    user_order_sub_list2 : "", // 주문목록 리스트
    
  });

  const common_product_state : any = writable([]);

  const common_car_state : any = writable([]);

  const common_company_state : any = writable([]);
  const common_type_state : any = writable([]);
  

  const common_user_state : any = writable([]);

  const common_user_order_state : any = writable([]);
  
  const common_user_order_sub_state : any = writable([]);
  
  
  
  const common_selected_state : any = writable([]); // 삭제용 데이터


  const common_type_object_state : any = writable({}); // 분류 객체용 


  export {menu_state,cookie_state,load_state,common_alert_state,common_search_state,login_state,url_state,common_product_state,common_toast_state,table_state,common_car_state,common_company_state,common_selected_state,common_user_state,common_user_order_state,common_user_order_sub_state,dashboard_state,common_type_state, table_real_state,common_type_object_state};
