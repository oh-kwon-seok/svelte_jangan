

//@ts-nocheck

import { writable } from 'svelte/store';
import {user_modal_state,user_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state,common_user_state,table_real_state} from '$lib/store/common/state';

import {select_query} from '$lib/store/common/function';

import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';
import { passwordCheck } from '$lib/module/common/function';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_data : any;
let table_real_data : any;
let user_data : any;

let selected_data : any;


let init_form_data = {
  uid : 0,
    id : '',
    code : '',
    customer_name : '',
    name : '',
    email : '',
    phone : '',
    staff_name : '',
    staff_phone : '',
    password : 'qwer12!@',
    car : '',
    used : 1,
    auth:'',


}


user_modal_state.subscribe((data) => {
    update_modal = data;
})

user_form_state.subscribe((data) => {
    update_form = data;
})


common_alert_state.subscribe((data) => {
  alert = data;
})
common_toast_state.subscribe((data) => {
  toast = data;
})

common_search_state.subscribe((data) => {
  search_state = data;
})

login_state.subscribe((data) => {
  login_data = data;
})
table_state.subscribe((data) => {
  table_data = data;
})

table_real_state.subscribe((data) => {
  table_real_data = data;
})

common_user_state.subscribe((data) => {
  user_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})
 
 



const userModalOpen = (data : any, title : any) => {
 console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    user_modal_state.update(() => update_modal);

   

  

    if(title === 'add'){
      update_form = {
        uid : 0,
          id : '',
          code : '',
          customer_name : '',
          name : '',
          email : '',
          phone : '',
          staff_name : '',
          staff_phone : '',
          password : 'qwer12!@',
          car : '',
          used : 1,
          auth:'',
      }
      user_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){

        Object.keys(update_form).map((item)=> {    
            if(item === 'car'){
              update_form[item] = data[item]['uid'];
            }else if(item === 'auth'){
              update_form[item] = data[item][0];
            
            
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            user_form_state.update(() => update_form);
            user_modal_state.update(() => update_modal);
            console.log('update_form : ', update_form);

    }
    if(title === 'check_delete'){
      let data =  table_data['user'].getSelectedData();

      common_selected_state.update(() => data);
    
  }
}










const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  update_form = {
    uid : 0,
      id : '',
      code : '',
      customer_name : '',
      name : '',
      email : '',
      phone : '',
      staff_name : '',
      staff_phone : '',
      password : 'qwer12!@',
      car : '',
      used : 1,
      auth:'',
  
  
  }

  common_alert_state.update(() => alert);
  user_modal_state.update(() => update_modal);
  user_form_state.update(()=>update_form);


}



const save = (param,title) => {

 
  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
  

  
    if(title === 'add'){
  
    
      if( param['code'] === '' || param['car'] === '' || param['password'] === '' || passwordCheck(param['password']) === false){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        user_modal_state.update(() => update_modal);
        
     

        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/user/save`
        try {
  
          
          let params = {
            id : param.code,
            code : param.code,
            name : param.name,
            customer_name : param.customer_name,
            email : param.email,
            phone : param.phone,
            staff_name : param.staff_name,
            staff_phone : param.staff_phone,

            password : param.password,
            car_uid : param.car,
            used : param.used,
            auth : 'user',
            token : login_data['token'],
          };
        axios.post(url,
          params,
        ).then(res => {
          console.log('res',res);
          if(res.data !== undefined && res.data !== null && res.data !== '' && res.data['success'] === true){
            console.log('실행');
            console.log('res:data', res.data);
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            user_modal_state.update(() => update_modal);

            update_form = {
              uid : 0,
                id : '',
                code : '',
                customer_name : '',
                name : '',
                email : '',
                phone : '',
                staff_name : '',
                staff_phone : '',
                password : 'qwer12!@',
                car : '',
                used : 1,
                auth:'',
            
            
            }
            user_form_state.update(() => update_form);

            select_query('user');
            

            return common_toast_state.update(() => toast);

          }else{
            alert['type'] = 'save';
            alert['value'] = true;

        
            return common_alert_state.update(() => alert);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };
      }


    
    }
    
    if(title === 'update'){
      const url = `${api}/user/update`
      
      let auth ;

      if(param.auth === 'ROLE_ADMIN'){
        auth= 'admin';

      }else{
        auth = 'user';
      }
      
      let data =  table_data['user_product_list'].getData();

      

      let checked_data = data.filter(item => {
        if(item['qty'] === "" || item['qty'] === undefined || item['qty'] === null){
          item['qty'] = 0; 

        }
        return item;
      })


    
      try {

      
        let params = {
          id : param.id,
          code : param.code,
          name : param.name,
          password : param.password,
          customer_name : param.customer_name,
          email : param.email,
          phone : param.phone,
          staff_name : param.staff_name,
          staff_phone : param.staff_phone,
          car_uid : param.car,
          used : param.used,
          auth : auth,
          token : login_data['token'],
          user_product : checked_data,

        };
      axios.post(url,
        params,
      ).then(res => {
        console.log('res',res);
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          console.log('실행');
          console.log('res:data', res.data);
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          user_modal_state.update(() => update_modal);
          update_form = {
            uid : 0,
              id : '',
              code : '',
              customer_name : '',
              name : '',
              email : '',
              phone : '',
              staff_name : '',
              staff_phone : '',
              password : 'qwer12!@',
              car : '',
              used : 1,
              auth:'',
          
          
          }
          
          user_form_state.update(()=> update_form);
          select_query('user');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      }catch (e:any){
        return console.log('에러 : ',e);
      };


     
    }if(title === 'check_delete'){
      let data =  selected_data;
      let uid_array = [];

      console.log('deleted_data : ', data);
      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        return common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['id']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/user/delete`
          try {
    
            let params = {
              id : uid_array,
            };
          axios.post(url,
            params,
          ).then(res => {
            console.log('res',res);
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
              console.log('실행');
              console.log('res:data', res.data);
              
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              user_modal_state.update(() => update_modal);
              update_form = {
                uid : 0,
                  id : '',
                  code : '',
                  customer_name : '',
                  name : '',
                  email : '',
                  phone : '',
                  staff_name : '',
                  staff_phone : '',
                  password : 'qwer12!@',
                  car : '',
                  used : 1,
                  auth:'',
              
              
              }

              user_form_state.update(()=> update_form);

              select_query('user');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
    
        }

      
    }
  }


  const userProductTable = (table_state,type,tableComponent) => {


    const url = `${api}/product/select`; 

  
    let start_date = moment().subtract(10, "year").format('YYYY-MM-DDTHH:mm:ss');

    let end_date = moment().add(1, "day").format('YYYY-MM-DDTHH:mm:ss');

    let search_text = '';
    let filter_title = 'all';
    let checked_data = [];
    let total_data = [];

    let params = 
    {
      start_date : start_date,
      end_date  : end_date,
      search_text : search_text,
      filter_title : filter_title,   
    };

   
    const config = {
      params : params,
      headers:{
        "Content-Type": "application/json",
        
      }
    }
      axios.get(url,config).then(res=>{
        if(table_state['user_product']){
          table_state['user_product'].destory();
        }

        if(res.data.length > 0){
          let product_data = res.data;
    
          const url = `${api}/user_product/info_select`;
           
          
  
          let params = 
          {
          user_id : update_form.id
          };
          const config = {
            params : params,
            headers:{
              "Content-Type": "application/json",
              
            }
          }
            axios.get(url,config).then(res=>{
              
              let user_checked_data =  res.data;

              // table_real_data['user_product_list'] = user_checked_data;

            
              // table_real_state.update(()=> table_real_data);
           


              for(let i=0; i < product_data.length; i++){
                let product_uid = product_data[i]['uid'];

                for(let j=0; j< user_checked_data.length; j++){
                  let user_checked_uid = user_checked_data[j]['product']['uid'];
                  if(product_uid === user_checked_uid){
                    checked_data.push(product_uid);
                    product_data[i]['selected'] = true; 
                    
                    product_data[i]['qty'] = user_checked_data[j]['qty'].toString(); 
                    
           
                    user_checked_data.splice(j,1);
                    break;
                  }

                }

              
                let new_obj = {
                  uid : parseInt(product_data[i]['uid']),
                  name : product_data[i]['name'],
                 
                  
                }
               
                product_data[i]['product'] = new_obj; 


              }


              console.log('product_data : ', product_data);


              table_real_data['user_product_list'] = product_data.filter(item=> {
                return item['selected'] === true;
              });

              console.log('table_real_data', table_real_data['user_product_list']);
              

              // 분류별로 정렬하는거지만 사용자가 하지말아달라고 요청함

              // product_data = product_data.sort((a, b) => {
              //   const prevData = a["type"]["name"];
              //   const afterData = b["type"]["name"];
              
              //   if (prevData < afterData) return -1;
              //   if (prevData > afterData) return 1;
              //   return 0;
              // }); ;
              table_real_data['user_product'] = product_data
              table_real_state.update(() => table_real_data);

              table_data['user_product'] =   new Tabulator(tableComponent, {
                height:TABLE_TOTAL_CONFIG['height'],
                layout:TABLE_TOTAL_CONFIG['layout'],
                pagination:TABLE_TOTAL_CONFIG['pagination'],
                paginationSize:1000,
                paginationSizeSelector:[10, 50, 100,1000,5000],
                movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
                paginationCounter: TABLE_TOTAL_CONFIG['paginationCounter'],
                paginationAddRow:TABLE_TOTAL_CONFIG['paginationAddRow'], //add rows relative to the table
                locale: TABLE_TOTAL_CONFIG['locale'],
                langs: TABLE_TOTAL_CONFIG['langs'],
                selectable: true,
               
      
                rowClick:function(e, row){
                  
                  
               
                  //e - the click event object
                  //row - row component
                  
                  row.toggleSelect(); //toggle row selected state on row click,
              },
      
                rowFormatter:function(row){
                      row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
                      let selected = row.getData().selected;

                      if(selected){
                        console.log('selected : ', selected);
                        row.getElement().classList.add("tabulator-selected");
                        row.toggleSelect();
                        console.log('selected : ', row.getData());
                      }
                },
             
             
      
                data : product_data,
              
                columns: TABLE_HEADER_CONFIG[type],
                
           
               
                });
                table_state.update(()=> table_data);
             
           })
        
         
       
        
    }else{
      
      if(table_state['user_product']){
        table_state['user_product'].destory();
      }

      table_data['user_product'] =   new Tabulator(tableComponent, {
        height:TABLE_TOTAL_CONFIG['height'],
        layout:TABLE_TOTAL_CONFIG['layout'],
        pagination:TABLE_TOTAL_CONFIG['pagination'],
        paginationSize:TABLE_TOTAL_CONFIG['paginationSize'],
        paginationSizeSelector:TABLE_TOTAL_CONFIG['paginationSizeSelector'],
        movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
        paginationCounter: TABLE_TOTAL_CONFIG['paginationCounter'],
        paginationAddRow:TABLE_TOTAL_CONFIG['paginationAddRow'], //add rows relative to the table
        locale: TABLE_TOTAL_CONFIG['locale'],
        langs: TABLE_TOTAL_CONFIG['langs'],
        selectable: true,
        placeholder:"데이터 없음",
        rowClick:function(e, row){
          //e - the click event object
          //row - row component
        console.log('로우클릭');
          row.toggleSelect(); //toggle row selected state on row click
      },

        rowFormatter:function(row){
              row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        },
     

        data : [],
      
        columns: TABLE_HEADER_CONFIG[type],
        
  
        });
        console.log('table_data  :', table_data);

        table_state.update(()=> table_data);


    }
     })

    
}


// 즐겨찾기 선택된 것
const userProduct2Table = (table_state,tableComponent) => {

  
  const url = `${api}/user_product/info_select`;
           
          
  let params = 
  {
  user_id : update_form.id
  };
 
  const config = {
    params : params,
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      let data = res.data;

      for(let i=0; i<data.length; i++){
        data[i]['type'] = data[i]['product']['type'];

      }

      console.log('data : ', data);
  
      table_data['user_product_list'] =   new Tabulator(tableComponent, {
        tooltips: true, // 전역 설정: 모든 열에 툴팁 적용
        height:TABLE_TOTAL_CONFIG['height'],
        layout:TABLE_TOTAL_CONFIG['layout'],
        movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
        locale: TABLE_TOTAL_CONFIG['locale'],
        langs: TABLE_TOTAL_CONFIG['langs'],
       
        placeholder:"데이터 없음",
        rowClick:function(e, row){
          //e - the click event object
          //row - row component
      
          row.toggleSelect(); //toggle row selected state on row click
      },
  
        // rowFormatter:function(row){
        //       row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        //       let selected = row.getData().selected;
  
        //       if(selected){
        //         row.getElement().classList.add("tabulator-selected");
        //         row.toggleSelect();
        //       }
        // },
        cellEdited:function(cell){
          // 행이 업데이트될 때 실행되는 코드
          var updatedData = cell.getData();
          console.log("Updated Data:", updatedData);
          // 여기에서 데이터를 처리하면 됩니다.
      },
        data : res.data.length > 0 ? data : [],
        columns: TABLE_HEADER_CONFIG['user_product_list'],
        
        });
  
        table_state.update(()=> table_data);
        table_real_state.update(()=> table_real_data);



    });
      

}

const userProductTabClick = (title) => {
  
  console.log(title);

 
  if(table_real_data['user_product'].length > 0){
   
  
    let check_data = [];
    if(title === "전체"){
      check_data = table_real_data['user_product'];
    }else {

      check_data = table_real_data['user_product'].filter(item=> {
        return item['type']['name'] === title;
      })
    }
    
    table_data['user_product'].setData(check_data);
    table_real_data['']

    table_state.update(()=> table_data);
    

  }
}


function updateUserProduct(cell:any,title:any) {



   
    // 분류별로 정렬하는거지만 사용자가 하지말아달라고 요청함
    // table_real_data['user_product_list'] = table_data['user_product'].getSelectedData().sort((a, b) => {
    //   const prevData = a["type"]["name"];
    //   const afterData = b["type"]["name"];
    
    //   if (prevData < afterData) return -1;
    //   if (prevData > afterData) return 1;
    //   return 0;
    // }); 
    table_real_data['user_product_list'] = table_data['user_product'].getSelectedData();

    table_real_state.update(()=> table_real_data);

    table_data['user_product_list'].setData(table_real_data['user_product_list']);
    
    

  
    table_state.update(()=> table_data);

  
}














export {userModalOpen,save,userProductTable,modalClose,userProductTabClick,userProduct2Table,updateUserProduct}