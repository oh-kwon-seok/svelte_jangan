

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {user_order_modal_state,user_order_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import { businessNumber,phoneNumber,commaNumber, getDayOfWeek} from '$lib/module/common/function';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER,CLIENT_INFO} from '$lib/module/common/constants';
import { user_form_state } from '../user/state';
import Excel from 'exceljs';
import { end } from '@popperjs/core';
const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_data : any;
let user_data : any;
let selected_data : any;





user_order_modal_state.subscribe((data) => {
    update_modal = data;
})

user_order_form_state.subscribe((data) => {
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

common_selected_state.subscribe((data) => {
  selected_data = data;
})

common_user_state.subscribe((data) => {
  user_data = data;
})
 
 



const userOrderModalOpen = (data : any, title : any) => {
 
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    user_order_modal_state.update(() => update_modal);

    
    if(title === 'add'){
      update_form = {
        uid : 0,
        user : '',
        
        price_status : '미수금',
        order_status : '주문완료',
        description : '**농협 김옥병(453103-56-019411) 오늘도 건강하고 힘나는 하루 되세요**',
        image_url:'',
        ship_image_url:'',
        req_date : moment().format('YYYY-MM-DD'),
        amount_array : [], 
        req_des : '',
        car : '',
        used : 1,
      
      }
      user_order_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){

        Object.keys(update_form).map((item)=> {    
            if(item === 'car'){
              update_form[item] = data[item]['uid'];
            }else if(item === 'user'){
              update_form[item] = data[item]['id'];
            }else if(item === 'amount_array'){
              
              if(data[item] !== null){
                update_form[item] = JSON.parse(data[item]);
              }else{
                update_form[item] = [];
              }
             
            
            }else{
              update_form[item] = data[item];
            }
           
        }); 
        
            user_order_form_state.update(() => update_form);
            user_order_modal_state.update(() => update_modal);
           
    }
    if(title === 'check_delete'){
      let data =  table_data['user_order'].getSelectedData();

      common_selected_state.update(() => data);
      
    
  }
  if(title === 'print'){
    let data =  table_data['user_order'].getSelectedData();

    common_selected_state.update(() => data);


  }
  if(title === 'printInvoice'){
    let data =  table_data['user_order'].getSelectedData();
    common_selected_state.update(() => data);
  }
}






const select_query = (type) => {
   
  const url = `${api}/${type}/select`; 
        
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
      table_data[type].setData(res.data);
      table_state.update(() => table_data);
     
   })

}


const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  user_order_modal_state.update(() => update_modal);


}

const save = (param,title) => {


  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
  
   
    if(title === 'add'){
      let data;
      if(table_data['user_order_sub_list']){
        data = table_data['user_order_sub_list'].getSelectedData();
      }else{
        alert['type'] = 'save';
        alert['value'] = true;

        return common_alert_state.update(() => alert);
      }
    
   

      for(let i=0; i<data.length; i++){
        Object.keys(data[i]).map((item)=> {    
          if(data[i][item] === undefined){
            data[i][item] = 0;
          }
        }); 

      }

      let checked_data = data.filter(item => {
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      })
      console.log('checked_data : ', checked_data);

    
      if( param['user'] === '' || param['car'] === '' || checked_data.length === 0 || checked_data.length === undefined ){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        user_order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        

       
        

         
        const url = `${api}/user_order/save`
        try {
  
         
          let params = {
            
            order_status : param.order_status,
            price_status : param.price_status,
            description : param.description,
            user_id : param.user,
            car_uid : param.car,
         
            amount_array : JSON.stringify(param.amount_array),

            used : param.used,
            auth : 'user',
            req_date : param.req_date,
            req_des : param.req_des,
            user_order_sub : checked_data,
            user_order_amount : param.amount_array,
            token : login_data['token'],
          };
        axios.post(url,
          params,
        ).then(res => {
          if(res.data !== undefined && res.data !== null && res.data !== '' ){
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            user_order_modal_state.update(() => update_modal);
            select_query('user_order');
            

            return common_toast_state.update(() => toast);

          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };
      }


    
    }
    
    if(title === 'update'){
      const url = `${api}/user_order/update`
      
    
      let data =  table_data['user_order_sub_list'].getSelectedData();

      let checked_data = data.filter(item => {
        if(item['buy_price'] === "" || item['buy_price'] === undefined || item['buy_price'] === null){
          item['buy_price'] = 0; 

        }
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      })

     
      console.log('param  : ', param );
      

        
        let params = {

          uid : param.uid,
          order_status : param.order_status,
          price_status : param.price_status,
          description : param.description,
          req_date : param.req_date,
          req_des : param.req_des,
        
          amount_array : JSON.stringify(param.amount_array),

          ship_image_url : param['ship_image_url'],  
          user_id : param.user,
          car_uid : param.car,
          used : param.used,
          auth : 'user',
          user_order_sub : checked_data,
          user_order_amount : param.amount_array,
          token : login_data['token'],

        
        };

       

      axios.post(url,
        params,
      ).then(res => {
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          user_order_modal_state.update(() => update_modal);
          update_form = {
            uid : 0,
            user : '',
            
            price_status : '미수금',
            order_status : '주문완료',
            description : '**농협 김옥병(453103-56-019411) 오늘도 건강하고 힘나는 하루 되세요**',
            image_url:'',
            ship_image_url:'',
            req_date : moment().format('YYYY-MM-DD'),
            amount_array : [],
            req_des : '',
            car : '',
            used : 1,
          
          }
          user_order_form_state.update(()=> update_form);
          select_query('user_order');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      


     
    }if(title === 'check_delete'){
      let data =  selected_data;


      let uid_array = [];

      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        
        return common_alert_state.update(() => alert);
   

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/user_order/delete`
          try {
    
            let params = {
              uid : uid_array,
            };
          axios.post(url,
            params,
          ).then(res => {
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
              
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              user_order_modal_state.update(() => update_modal);
              update_form = {
                uid : 0,
                user : '',
                
                price_status : '미수금',
                order_status : '주문완료',
                description : '**농협 김옥병(453103-56-019411) 오늘도 건강하고 힘나는 하루 되세요**',
                image_url:'',
                ship_image_url:'',
                req_date : moment().format('YYYY-MM-DD'),
                amount_array : [],
                req_des : '',
                car : '',
                used : 1,
              
              }

              user_order_form_state.update(()=> update_form);

              select_query('user_order');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            
            
            alert['type'] = 'error';
            alert['value'] = true;
            return common_alert_state.update(() => alert);
          };
        }
  
    }
    if(title === 'print'){
      let data = selected_data;

      console.log('data : ', data);
      if(data.length === 0){
        alert['type'] = 'print';
        alert['value'] = true;

        return common_alert_state.update(() => alert);
   
      
      }else{
        printContent(data);    
      }
    
        
    } //
    if (title === 'printInvoice') {
      let data = selected_data;

      if (data.length === 0) {
        alert['type'] = 'printInvoice';
        alert['value'] = true;

        return common_alert_state.update(() => alert);
      } //
      else {
        printInvoice(data);
      }
    }
  }







  const userOrderSubTable = (table_state,type,tableComponent) => {


    const url = `${api}/product/select`; 

  
    let start_date = moment().subtract(10, "year").format('YYYY-MM-DDTHH:mm:ss');

    let end_date = moment().add(1, "day").format('YYYY-MM-DDTHH:mm:ss');

    let search_text = '';
    let filter_title = 'all';
    let checked_data = [];
  

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
        if(table_state['user_order_sub_list']){
          table_state['user_order_sub_list'].destory();
        }

        if(res.data.length > 0){
          let product_data = res.data;
          let url;
          let params;
          update_modal['title']
          if(update_modal['title'] === 'add'){
            url = `${api}/user_product/info_select`;
            params = { user_id : update_form.user};

          }
          if(update_modal['title'] === 'update'){
             url = `${api}/user_order_sub/info_select`;
             params = { user_order_uid : update_form.uid};
          }
       

          const config = {
            params : params,
            headers:{
              "Content-Type": "application/json",
              
            }
          }
            axios.get(url,config).then(res=>{
              
              let user_order_checked_data =  res.data;
          

              for(let i=0; i < product_data.length; i++){
                let product_uid = product_data[i]['uid'];

                for(let j=0; j< user_order_checked_data.length; j++){
                  let user_order_checked_uid = user_order_checked_data[j]['product']['uid'];
                  if(product_uid === user_order_checked_uid){
                    checked_data.push(product_uid);
                    product_data[i]['selected'] = true; 
                    if(update_modal['title'] === 'add'){
                      product_data[i]['qty'] = user_order_checked_data[j]['qty'].toString(); 
                   
                    }else if(update_modal['title'] === 'update'){
                      product_data[i]['qty'] = user_order_checked_data[j]['qty'].toString(); 
                      product_data[i]['price'] = user_order_checked_data[j]['price'].toString();
                      product_data[i]['supply_price'] = user_order_checked_data[j]['supply_price'].toString();
                      product_data[i]['buy_price'] = user_order_checked_data[j]['buy_price'].toString();
                      
                       
                      
                    }
              
                    user_order_checked_data.splice(j,1);
                    break;
                  }

                }


              }

            
              // table_data['user_order_sub'].setData(res.data);
              // table_state.update(() => table_data);
              table_data['user_order_sub_list'] =   new Tabulator(tableComponent, {
                height:"40vh",
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
               
                  row.toggleSelect(); //toggle row selected state on row click
              },
      
                rowFormatter:function(row){
                      row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
                      let selected = row.getData().selected;

                      if(selected){
                        row.getElement().classList.add("tabulator-selected");
                        row.toggleSelect();
                      }
                },
                cellEdited:function(cell){
                  // 행이 업데이트될 때 실행되는 코드
                  var updatedData = cell.getData();
           
              },
             
             
      
                data : product_data,
              
                columns: TABLE_HEADER_CONFIG['user_order_sub_list'],
                
           
               
                });
                table_state.update(()=> table_data);
             
           })
        
         
       
        
    }else{
      
      if(table_state['user_order_sub_list']){
        table_state['user_order_sub_list'].destory();
      }

      table_data['user_order_sub_list'] =   new Tabulator(tableComponent, {
        height:"25vh",
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
       
          row.toggleSelect(); //toggle row selected state on row click
      },

        rowFormatter:function(row){
              row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        },
     

        data : [],
      
        columns: TABLE_HEADER_CONFIG['user_order_sub_list'],
      
  
        });
        
        table_state.update(()=> table_data);


    }
     })

    
}


const userOrderFileUpload = (e) => {
  const file = e.target.files[0];
    if (file) {
      // 이미지 파일이 선택된 경우 처리
      const reader = new FileReader();

      

      reader.onload = (e) => {
        update_form['ship_image_url'] = e.target.result;
       

        user_order_form_state.update(()=> update_form);
      };
      
      
      
      reader.readAsDataURL(file);
    }
}


const userTable = (table_state,type,tableComponent) => {
  if(table_state['user']){
    table_state['user'].destory();
  }
            table_data[type] =   new Tabulator(tableComponent, {
              height:"25vh",
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
             
    

           
              data : user_data, 
              columns: [
                {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
                cellClick:function(e : any, cell:any){
                    cell.getRow().toggleSelect();
                    
                }},
                {title:"ID", field:"id", width:150, headerFilter:"input"},
                {title:"사업자번호", field:"code", width:150, headerFilter:"input",
                formatter:function(cell : any){
                    var value = cell.getValue();
                return businessNumber(value);
                 },
                },
                {title:"상호명", field:"customer_name", width:150, headerFilter:"input", 
                formatter:function(cell : any){
                    var value = cell.getValue();
                    
                return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
                 },
        
                cellClick:function(e : any, cell:any){
               
                    let row = cell.getRow();
                   if(row){
                    let id = row.getData().id;
                    let car = row.getData().car['uid'];
                    
                    update_form['user'] = id;
                    update_form['car'] = car;
                 
                    user_order_form_state.update(() => update_form);
                
                   }else{
                  
                   }
                }


                },
                {title:"지정차량", field:"car.name", width:150, headerFilter:"input"},
                {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
                    var value = cell.getValue();
                return phoneNumber(value);
                 },},
          
                {title:"이메일", field:"email", width:150, headerFilter:"input"},
                
                {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
                formatter: function(cell : any, formatterParams: any, onRendered: any) {
                    // Luxon을 사용하여 datetime 값을 date로 변환
                    const datetimeValue = cell.getValue();
                    const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
                    return date;
                }},     
            
           ],
           rowClick:function(e, row){
            //e - the click event object
            //row - row component
            
            row.toggleSelect(); //toggle row selected state on row click
        },

              });
              table_state.update(()=> table_data);
        
}



const printInvoice = async (data) => {
  data.sort((a, b) => moment(b.req_date) - moment(a.req_date));
  let page;
  let obj = {};

  if (Array.isArray(data) && data.length > 0) {
    for (const item of data) {
      const url = `${api}/user_order_sub/info_select`;
      const params = { user_order_uid: item['uid'] };
      const config = {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const res = await axios.get(url, config);

        res.data.forEach((element) => {
          let company = element.userOrder.user.customer_name;
          let product = element.product.name;
          let qty = parseInt(element.qty);
            
          if (!obj[item.req_date]) {
            obj[item.req_date] = {
              [company]: [
                {[product]: qty}
              ]
            }
          } //
          else {
            if (!obj[item.req_date][company]) {
              obj[item.req_date][company] = [
                {[product]: qty}
              ]
            } //
            else {

              let p = false;
              obj[item.req_date][company].forEach(element => {
                if (product in element) {
                  element[product] += qty;
                  p = true;
                }
              });

              if (!p) {
                obj[item.req_date][company].push({ [product]: qty });
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  console.log(obj);

  page = `
            <html>
            <head>
                <style>
                    @media print {
                        @page {
                            size: A4;
                            margin: 0.5cm;
                        }

                        body {
                            font-family: 'Nanum Gothic', sans-serif;
                            margin: 0;
                            padding: 0px 30px 0px 5px;
                            box-sizing: border-box;
                            background-color: #fff;
                            display: flex;
                            font-size: 15px;
                            flex-direction: column;
                        }

                        .table-container table,
                        .table-container th,
                        .table-container td {
                            border: none;
                        }

                        .table-container th,
                        .table-container td {
                            padding: 3px;
                        }

                        .table_row {
                            padding: 5px;
                            display: flex;
                            flex-direction: row;
                        }
                    }
                </style>
            </head>
            <body class="page">
        `;

  for (const req_date in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, req_date)) {
      const companys = obj[req_date];

      page += `
              <div class="container">
                <div style="margin-top : 38px; display:flex; flex-direction : row; width : 100%;">
                  <div class="table_row">
                    <div style="font-size: 17px;">${moment(req_date).format('YY. MM. DD')} (${getDayOfWeek(moment(req_date).format('dddd'))})</div>
                  </div>
                </div>

                <div style="margin-top:15px;" class="table-container">
            `;

      let index = 1;
  
      for (const company in companys) {
        if (Object.prototype.hasOwnProperty.call(companys, company)) {
          // 객체 배열 element
          const element = companys[company];
          
          page += `
                  <div  class="table_row">
                    <div style="width:5%;">${index++}.</div>
                    <div style="width:15%; font-weight: bold;">${company}</div>
                    <div style="width:85%; white-space: pre-wrap;">`;
          
          element.forEach(object => {

            console.log(object);
            for (const product in object) {
              if (Object.prototype.hasOwnProperty.call(object, product)) {
                const qty = object[product];
                
                page += `${product} : ${qty}개,    `;
              }
            }
          
          });
          page += `</div></div>`;
        }
      }
      

      page += `
                </div>
              </div>
            `;
    }
  }

  page += `</body></html>`;

  console.log(page);

  // 프린트 다이얼로그가 열리기 전에 현재 창의 내용을 변경하지 않도록
  const printWindow : any = window.open('', '_blank');          

  printWindow.document.write(page);
  printWindow.document.close();

  // 프린트 다이얼로그가 열릴 때 현재 창의 내용을 복원
  printWindow.onload = () => {
    document.body.innerHTML = originalContent;
     
    // 프린트 다이얼로그 호출
    printWindow.print();
  };

  // 프린트 다이얼로그가 닫힐 때 현재 창의 내용을 원복
  printWindow.onafterprint = () => {
    printWindow.close();
  }; 

  // 프린트 다이얼로그 호출
  printWindow.print();
};


/**
 * 업체 전달 메소드
 */



const test = async() => {
    
 

    const url = `${api}/user_order_amount/select`;
		const params = { user_id : 'ohjin999',  end_date : '2024-03-31'};
		const config = {
			params: params,
			headers: {
				'Content-Type': 'application/json'
			}
		};

    try {

      const test = await axios.get(url, config);

      let resData = test;
      console.log('resData : ', resData['data']);
  

    }catch(error){
      console.log('err : ',error);
    }
    

  };




const userOrderDelivery = async (type) => {
	let data = table_data[type].getSelectedData();

  

	if (data.length <= 0) {
		alert['title'] = 'user_order_delivery_no_content';
		alert['value'] = true;
		return common_alert_state.update(() => alert);
	}

	let prevCompany: string = '';
  console.log('data : ', data);
	data.forEach((item) => {
		if (prevCompany === '') {
			prevCompany = item.user.customer_name;
		} //
		else {
			if (prevCompany !== item.user.customer_name) {
				alert['title'] = 'user_order_delivery';
				alert['value'] = true;
				return common_alert_state.update(() => alert);
			}
		}
	});

  let totalAmount = data[0]['totalAmount'] ; // 총 입금액
  let totalUnpaidPrice = data[0]['totalUnpaidPrice'] ; // 총 매출액


  console.log('totalAmount',totalAmount);
  console.log('totalUnpaidPrice',totalUnpaidPrice);
  
   

	let obj = {};
	let company = '';
  

	for (const item of data) {
		const url = `${api}/user_order_sub/info_select`;
		const params = { user_order_uid: item['uid'] };
		const config = {
			params: params,
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.get(url, config);

			let resData = res.data;

     
			resData.forEach((object) => {
				let reqDate = object.userOrder.req_date;
				


        let price = parseInt(object.price);
				let product = object.product.name;
				let qty = parseInt(object.qty);
				let supplyPrice = parseInt(object.supply_price);
				company = object.userOrder.user.customer_name;

				if (!obj[reqDate]) {
					obj[reqDate] = {
						[product]: {
							qty: qty,
							price: price,
							supplyPrice: supplyPrice
						}
					};
				} //
				else {
					if (obj[reqDate][product]) {
						let element = obj[reqDate][product];
						element.qty += qty;
						element.price = element.price > price ? element.price : price;
						element.supply_price = element.price * element.qty;
						obj[reqDate][product] = element;
					} //
					else {
						obj[reqDate][product] = {
							qty: qty,
							price: price,
							supplyPrice: supplyPrice
						};
					}
				}
			});
		} catch (error) {
			//
			console.error('Error fetching data:', error);
		}
	}
  
  
    console.log('obj : ', obj);
    let amountDateArray = Object.keys(obj);

    let total_amount_array = {};
    
    

    for(let i=0; i<amountDateArray.length; i++){   // 입금액 구하기
      const url = `${api}/user_order_amount/select`;
      const params = { user_id : data[0]['user']['id'],  end_date : amountDateArray[i]};
      const config = {
        params: params,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {

        const res = await axios.get(url, config);

        let resData = res.data;

        if(resData.length > 0){   // 해당날짜 기준 입금액이 존재한다면
          let newAmount = resData.reduce((accumulator, currentValue) => {
            return parseInt(accumulator) + parseInt(currentValue.amount);
          
          }, 0);
          if(total_amount_array.hasOwnProperty(amountDateArray[i])){

          }else{
            total_amount_array[amountDateArray[i]] = newAmount;
          }


        }else{  // 해당날짜 기준 입금액이 존재하지 않는다면
          if(total_amount_array.hasOwnProperty(amountDateArray[i])){

          }else{
            total_amount_array[amountDateArray[i]] = 0;
          }

        }


      }catch(error){
        console.log('err : ',error);
      }
    }

    let total_supply_array = {};
    
    for(let i=0; i<amountDateArray.length; i++){   // 총매출액 구하기
      const url = `${api}/user_order_sub/supply_price_select`;
      const params = { user_id : data[0]['user']['id'],  req_date : amountDateArray[i]};
      const config = {
        params: params,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {

        const res = await axios.get(url, config);

        let resData = res.data;
        if(resData.length > 0){   // 해당날짜 기준 입금액이 존재한다면
          let newSupplyPrice = resData.reduce((accumulator, currentValue) => {
            return parseInt(accumulator) + parseInt(currentValue.supply_price);
          
          }, 0);
          if(total_supply_array.hasOwnProperty(amountDateArray[i])){

          }else{
            total_supply_array[amountDateArray[i]] = newSupplyPrice;
          }


        }else{  // 해당날짜 기준 입금액이 존재하지 않는다면
          if(total_supply_array.hasOwnProperty(amountDateArray[i])){

          }else{
            total_supply_array[amountDateArray[i]] = 0;
          }

        }
   
      }catch(error){
        console.log('err : ',error);
      }
    }



    let oldestDate = null;
    let latestDate = null;

// 특정 객체의 키를 확인하고, 가장 오래된 날짜 찾기
for (let key in total_amount_array) {
    if (total_amount_array.hasOwnProperty(key) && Object.prototype.toString.call(new Date(key)) === '[object Date]') {
        let currentDate = new Date(key);

        // 가장 오래된 날짜인지 확인
        if (!oldestDate || currentDate < oldestDate) {
            oldestDate = currentDate;
        }
        if (!latestDate || currentDate > latestDate) {
          latestDate = currentDate;
        }
    }
}

// 가장 오래된 날짜 출력 (이월 기준)
  let prev_date = moment(oldestDate).format('YYYY-MM-DD');

  let latest_date = moment(latestDate).format('YYYY-MM-DD');

  console.log('latest_date : ', latest_date);
  console.log('prev_date : ', prev_date);


  let prevAmount = total_supply_array[prev_date] - total_amount_array[prev_date];


  console.log('prevAmount : ', prevAmount);
  console.log('supply : ', total_supply_array[prev_date]);
  console.log('amount : ', total_amount_array[prev_date]);
  console.log('latest_date amount : ', total_amount_array[latest_date]);
  


	// 엑셀 생성
	const workbook = new Excel.Workbook();
	// 생성자
	workbook.creator = '작성자';
	// 최종 수정자
	workbook.lastModifiedBy = '최종 수정자';
	// 생성일(현재 일자로 처리)
	workbook.created = new Date();
	// 수정일(현재 일자로 처리)
	workbook.modified = new Date();

	
	let searchDate =
		moment(prev_date).format('YYYY.MM.DD') + '~' + moment(latest_date).format('YYYY.MM.DD');

	let file_name = company + '(' + searchDate + ').xlsx';

	workbook.addWorksheet(company);

	const worksheet = workbook.getWorksheet(company);

	worksheet.getCell('A1').value = company;
  worksheet.mergeCells('A1:H1');
  worksheet.getRow(1).height = 60;
	worksheet.getCell(`A1`).alignment = { vertical: 'middle', horizontal: 'center' };
	worksheet.getCell('A2').value = searchDate;
	worksheet.getCell('D2').value = '거 래 처 원 장';
	worksheet.getCell('F2').value = '장안유통(대청 254번)';
	worksheet.getCell('H2').value = moment().format('YYYY.MM.DD');

	let columns = [
		{ name: '날짜' },
		{ name: '품명[적요]' },
		{ name: '수량' },
		{ name: '단가' },
		{ name: '공급가액' },
		
		{ name: '잔액' }
	];

	let totalSupplyPrice = 0;
	let totalQty = 0;
	let rows = [];




   



  rows.push([
    "이월",
    "",
    "",
    "",
    "",
    prevAmount.toLocaleString(),
  ]);

	Object.keys(obj).forEach((date) => {
		let sumSupplyPrice = 0;
		let sumQty = 0;

    if(total_amount_array.hasOwnProperty(date) && total_amount_array[date] > 0 ) {
      rows.push([
        date,
        '입금',
        0,
        0,
        (total_amount_array[date]).toLocaleString(),
        (prevAmount -= total_amount_array[date]).toLocaleString(),
      ]);
    }

		Object.keys(obj[date]).forEach((productName) => {
			const data = obj[date][productName];


			// 데이터 행 추가
			rows.push([
				date,
				productName,
				parseInt(data.qty).toLocaleString(),
				parseInt(data.price).toLocaleString(),
				parseInt(data.supplyPrice).toLocaleString(),
				(prevAmount += parseInt(data.supplyPrice)).toLocaleString(),
			]);

			sumQty += parseInt(data.qty);
			totalQty += parseInt(data.qty);
			sumSupplyPrice += parseInt(data.supplyPrice);
			totalSupplyPrice += parseInt(data.supplyPrice);
		});


  
		// 소계 행 추가
		rows.push([
			'소 계',
			'',
			sumQty.toLocaleString(),
			'',
			sumSupplyPrice.toLocaleString(),
		
			''
		]);
	});

	// 총계 행 추가
	rows.push([
		'총 계',
		'',
		totalQty.toLocaleString(),
		'',
		totalSupplyPrice.toLocaleString(),
		
		''
	]);

	worksheet.addTable({
		name: 'OrderDelivery',
		ref: 'A3',
		style: {
			theme: 'none'
		},
		columns: columns,
		rows: rows
  });

  const table = worksheet.getTable('OrderDelivery');

  const [startCell, endCell] = table.table.tableRef.split(':');
  // 시작점과 끝점의 행과 열 얻기
  const [startCol, startRow] = startCell.match(/[A-Z]+|\d+/g).map((v, i) => (i === 0 ? columnToNumber(v) : parseInt(v)));
  const [endCol, endRow] = endCell.match(/[A-Z]+|\d+/g).map((v, i) => (i === 0 ? columnToNumber(v) : parseInt(v)));

  // 각 셀에 대해 테두리 적용
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = worksheet.getCell(row, col);
      const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.border = border;
    }
  }

  worksheet.getRow(1).font = {bold: true, size: 14};
  worksheet.getColumn(1).width = 13;
  worksheet.getColumn(2).width = 45;
  worksheet.getColumn(3).width = 7;
  worksheet.getColumn(4).width = 13;
  worksheet.getColumn(5).width = 13;
  worksheet.getColumn(6).width = 13;
  worksheet.getColumn(7).width = 13;
  worksheet.getColumn(8).width = 13;

  workbook.xlsx.writeBuffer().then((data) => {
		const blob = new Blob([data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const url = window.URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = file_name;
		anchor.click();
		window.URL.revokeObjectURL(url);
	});
};

// 열 문자를 숫자로 변환하는 함수
function columnToNumber(column) {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result *= 26;
    result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return result;
}





const userOrderExcelDownload = (type,config) => {
  
  let data =  table_data[type].getSelectedData();
  console.log('data  : ', table_data[type].getSelectedData());

  
  if(data.length > 0){
    // 모든 객체에서 공통된 키(key) 이름을 찾기 위한 반복문
    for (let i = 0; i <  data.length; i++) {
      let currentObject =  data[i];

      Object.keys(currentObject).map((key)=> {    
      
       
          data[i][key] = data[i][key];
        

        if(typeof currentObject[key] === "object"){
          data[i][key] = data[i][key]['name'];
        } else {
          data[i][key] = data[i][key];
        }
      
      }); 
    }

    try {

      let text_title : any= '';
      switch(type){
          case 'user_order': 
              text_title = '주문 관리';
          break;
          
          default:
              text_title = '제목 없음';
          break;
    }

    const workbook = new Excel.Workbook();
      // 엑셀 생성

      // 생성자
      workbook.creator = '작성자';
     
      // 최종 수정자
      workbook.lastModifiedBy = '최종 수정자';
     
      // 생성일(현재 일자로 처리)
      workbook.created = new Date();
     
      // 수정일(현재 일자로 처리)
      workbook.modified = new Date();

      let file_name = text_title + moment().format('YYYY-MM-DD HH:mm:ss') + '.xlsx';
      let sheet_name = moment().format('YYYYMMDDHH:mm:ss');
   
    
      workbook.addWorksheet(text_title);
         

      const sheetOne = workbook.getWorksheet(text_title);
           
           
            
      // 컬럼 설정
      // header: 엑셀에 표기되는 이름
      // key: 컬럼을 접근하기 위한 key
      // hidden: 숨김 여부
      // width: 컬럼 넓이
      sheetOne.columns = config;
   
      const sampleData = data;
      const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
     
      sampleData.map((item, index) => {
        sheetOne.addRow(item);
     
        // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
        
        for(let loop = 1; loop <= 6; loop++) {
          const col = sheetOne.getRow(index + 2).getCell(loop);
          col.border = borderStyle;
          col.font = {name: 'Arial Black', size: 10};
        }
      
    });


        
   
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file_name;
        anchor.click();
        window.URL.revokeObjectURL(url);
      })
    } catch(error) {
      console.error(error);
    }

  }else{
    alert('데이터를 선택해주세요');
  }

}


const amountAddRow = () => {
  let new_obj = {
    uid : parseInt(update_form['amount_array'].length) + 1, 
    amount_date : moment().format('YYYY-MM-DD'),
    amount : 0,

  }


  update_form['amount_array'].push(new_obj);
  console.log('update_form : ', update_form);
  user_form_state.update(()=> update_form);

}
const amountDeleteRow = () => {
  console.log('눌림');

  update_form['amount_array'].pop();

  user_form_state.update(()=> update_form);

}
const amountAllDeleteRow = () => {
 

  update_form['amount_array'] = [];

  user_form_state.update(()=> update_form);

}
const amountSelectDeleteRow = (index) => {
  
  console.log('item_uid : ', index);

  update_form['amount_array'].splice(index,1);
  
  user_form_state.update(()=> update_form);

}




const printContent = (data : any) => {
  

  const generateA4Pages = (data) => {
    const pages = data.map((item, index) => {
      const url = `${api}/user_order_sub/info_select`;
      const params = { user_order_uid: item['uid'] };
      const config = {
        params: params,
        headers: {
          "Content-Type": "application/json",
        }
      };
  
      return axios.get(url, config).then(res => {
        let amount_array = item.amount_array ;

        if(amount_array !==null ){
         
          amount_array = JSON.parse(item.amount_array).reduce((accumulator, currentValue) => {
            return parseInt(accumulator) + parseInt(currentValue.amount);
          
          }, 0);
        }else{
          
          amount_array = 0;
        }


        console.log('amount_array : ', amount_array);
        
        
        let user_order_checked_data = res.data;
        const productDetails = user_order_checked_data.length > 0 && user_order_checked_data.map((item2, index2) => `
         


          <div style="padding : 1px;" class="table_row">
            <div style="width:10%; text-align : center; ">${index2 + 1}</div>
            <div style="width:38%; text-align : left; ">${item2.product.name}</div>
            <div style="width:7%; text-align : right; ">${commaNumber(item2.qty)}</div>
            <div style="width:2%; text-align : left; "></div>
   
            <div style="width:15%; text-align : right; ">${commaNumber(item2.price)}</div>
            <div style="width:15%; text-align : right; ">${commaNumber(item2.supply_price)}</div>
            <div style="width:13%; text-align : left; "></div>
          </div>

        `).join('');
  
        return `
          <html>
            <head>
              <style>
                @media print {
                  @page {
                    size: A4;
                    margin: 0.5cm;
                  }
                  body {
                    // font-family: 'Nanum Gothic', sans-serif;
                    font-family: 'Gulim', "굴림", serif, sans-serif;
                    
                    margin: 0;
                    padding: 0px 30px 0px 5px;
                    box-sizing: border-box;
                    background-color: #fff;
                    display: flex;
                    font-size : 12px;
                    flex-direction: column;
                  }
                  .container {
                    width: 100%;
                    height: 49%;
                  }
                  .table-container table, .table-container th, .table-container td {
                    border: none;
                  }
              
                  .table-container th, .table-container td {
                    padding: 3px; /* 원하는 패딩 값 설정 */
                  }
    
                  .table_row {
                    padding: 5px; 
    
                    display:flex; flex-direction : row;
                  }


                }
              </style>
            </head>
            <body class="page">
              <div class="container">
            <div style="margin-top : 38px; display:flex; flex-direction : row; width : 100%;" >
                <div style="display:flex; flex-direction : column; width : 60%;" class="table-container">
                    <div class="table_row">
                        
                        <div style="width : 20%; text-align : right;  ">${item['uid']}</div>
                    
                    </div>
                   
                    <div style="margin-top : 7px;"class="table_row">
                        
                      <div style="width :22%;  "></div>
                      <div style="width :10%; text-align : left;  ">${moment(item['req_date']).format('YYYY')}</div>
                      <div style="width :2%;"></div>
                      <div style="width :10%; text-align : left;  ">${moment(item['req_date']).format('MM')}</div>
                 
                      <div style="width :10%; text-align : left;  ">${moment(item['req_date']).format('DD')}</div>
                    
                    </div>
                  <div class="table_row">
                        
                    <div style="width :15%;  "></div>
                    <div style="width :85%; text-align : left;  font-size:20px; letter-spacing: 3px;">${item['user']['customer_name']}</div>
                   
                  </div>
                  <div style="margin-top : 20px;">
                  </div>
                <div style="padding : 5px 5px 0px 5px"class="table_row">
                        
                  <div style="width :40%;  "></div>
                  <div style="width :60%; text-align : left; font-size:18px;font-weight : bold; ">${commaNumber(item['totalSupplyPrice'])}</div>
                
  
                </div>
              
                <div >
                        
                  <div style="width :22%;  "></div>
                  <div style="width :78%; text-align : right; font-size:16px; ">[농협 김옥병(453103-56-019411)]</div>
                
  
                </div>
                
                </div>
                <div style="display:flex; flex-direction : column; width : 40%;" class="table-container">
                <div style="margin-top : 3px;">
                </div>  
                <div class="table_row">

                      <div style="width:35%;  "></div>
                      <div style="width:50%; text-align : right; ">${CLIENT_INFO.fax}</div>
                      <div style="width:15%; "></div>
                  </div>
                  <div class="table_row">

                      <div style="width:17%; "></div>
                      <div style="width:83%; text-align : left;  font-size:14px; letter-spacing: 3px;">${CLIENT_INFO.code}</div>
                    
                  </div>
                <div  style="padding : 10px 5px 0px 5px;" class="table_row">
                  <div style="width:17%; text-align : center; "></div>
                  <div style="width:58%; text-align : left; ">${CLIENT_INFO.company_name}</div>
                  <div style="width:25%; text-align : center; ">${CLIENT_INFO.name}</div>
                
                </div>
                <br/>
                <div style="padding : 0px 5px 0px 5px;"class="table_row">
                  <div style="width:17%;  "></div>
                  <div style="width:83%; text-align : left; ">${CLIENT_INFO.address}</div>
                 
                </div>
                
                <br/>
                <div class="table_row">
                  <div style="width:17%; "></div>
                  <div style="width:48%; text-align : left; ">${CLIENT_INFO.type}</div>
                  <div style="width:35%; text-align : left; ">${CLIENT_INFO.type2}</div>
                  
                </div>
              </div>
            </div>
              
              
              
              
              
              
            <div style="margin-top:10px;min-height: 20vh; max-height: 20vh;  "class="table-container">
                

            ${productDetails}


              
              </div>
              <div style="margin : 25px 0px 0px 40px; text-align: left;">
              ${item['description']}
              </div>
           
              </div>


              <div class="container">
              <div style="margin-top : 48px; display:flex; flex-direction : row; width : 100%;" >
                  <div style="display:flex; flex-direction : column; width : 60%;" class="table-container">
                      <div class="table_row">
                          
                          <div style="width : 20%; text-align : right;  ">${item['uid']}</div>
                      
                      </div>
                     
                      <div style="margin-top : 7px;"class="table_row">
                          
                        <div style="width :22%;  "></div>
                        <div style="width :10%; text-align : left;  ">${moment(item['req_date']).format('YYYY')}</div>
                        <div style="width :2%;"></div>
                        <div style="width :10%; text-align : left;  ">${moment(item['req_date']).format('MM')}</div>
                   
                        <div style="width :10%; text-align : left;  ">${moment(item['req_date']).format('DD')}</div>
                      
                      </div>
                    <div class="table_row">
                          
                      <div style="width :15%;  "></div>
                      <div style="width :85%; text-align : left;  font-size:20px; letter-spacing: 3px;">${item['user']['customer_name']}</div>
                     
                    </div>
                    <div style="margin-top : 20px;">
                    </div>
                  <div style="padding : 5px 5px 0px 5px"class="table_row">
                          
                    <div style="width :40%;  "></div>
                    <div style="width :60%; text-align : left; font-size:18px;font-weight : bold; ">${commaNumber(item['totalSupplyPrice'])}</div>
                  
    
                  </div>
                
                  <div >
                          
                    <div style="width :22%;  "></div>
                    <div style="width :78%; text-align : right; font-size:16px; ">[농협 김옥병(453103-56-019411)]</div>
                  
    
                  </div>
                  
                  </div>

                  <div style="display:flex; flex-direction : column; width : 40%;" class="table-container">
                <div style="margin-top : 3px;">
                </div>  
                <div class="table_row">

                      <div style="width:35%;  "></div>
                      <div style="width:50%; text-align : right; ">${CLIENT_INFO.fax}</div>
                      <div style="width:15%; "></div>
                  </div>
                  <div class="table_row">

                      <div style="width:17%; "></div>
                      <div style="width:83%; text-align : left;  font-size:14px; letter-spacing: 3px;">${CLIENT_INFO.code}</div>
                    
                  </div>
                <div style="padding : 10px 5px 0px 5px;" class="table_row">
                  <div style="width:17%; text-align : center; "></div>
                  <div style="width:58%; text-align : left; ">${CLIENT_INFO.company_name}</div>
                  <div style="width:25%; text-align : center; ">${CLIENT_INFO.name}</div>
                
                </div>
                <br/>
                <div style="padding : 0px 5px 0px 5px;"class="table_row">
                  <div style="width:17%;  "></div>
                  <div style="width:83%; text-align : left; ">${CLIENT_INFO.address}</div>
                 
                </div>
                
                <br/>
                <div class="table_row">
                  <div style="width:17%; "></div>
                  <div style="width:48%; text-align : left; ">${CLIENT_INFO.type}</div>
                  <div style="width:35%; text-align : left; ">${CLIENT_INFO.type2}</div>
                  
                </div>
              </div>

              





              
              </div>
                
                
                
                
                
                
              <div style="margin-top:15px;min-height: 20vh; max-height: 20vh;  "class="table-container">
                  
  
              ${productDetails}
  
  
                
                </div>
                <div style="margin : 25px 0px 0px 40px; text-align: left;">
               

                <span style="text-align : left;">전미수금 : ${item.totalUnpaidPrice-amount_array-item.totalSupplyPrice > 0? commaNumber(item.totalUnpaidPrice-amount_array-item.totalSupplyPrice) : 0}</span>
    
                <span style="text-align : left;">&nbsp;&nbsp;&nbsp;합계 : ${commaNumber(item.totalUnpaidPrice-amount_array)}</span>
    
    
                <span style="text-align : left; font-weight : bold; padding-left : 50px;">입금 : ${commaNumber(amount_array)}       </span>
                <span style="text-align : left; font-weight : bold; padding-left : 150px;">잔액 : ${commaNumber(item.totalSupplyPrice-amount_array)}       </span>
            
                <br/>
           
             
                
                ${item.description}

                </div>
             
                </div>


          
  
            </body>
          </html>
        `;
      });
    });
  
    // pages는 Promise 객체의 배열이므로 Promise.all을 사용하여 모든 페이지의 HTML을 얻은 뒤 반환합니다.
    return Promise.all(pages).then(htmlPages => htmlPages.join(''));
   
  }
  
 
  const originalContent = document.body.innerHTML;

  const closePopup = () => {
    document.body.innerHTML = originalContent;
    printWindow.close();
    
  };
  
 
  const printWindow: any = window.open('', '_blank');

  generateA4Pages(data)
    .then(content => {
      printWindow.document.write(content);
      printWindow.document.close();
      // 프린트 다이얼로그 호출
      printWindow.print();
    })
    .catch(error => {
      console.error(error);
    });


  // 팝업이 열린 후에 프린트 다이얼로그가 뜨면서 팝업이 닫히지 않도록 설정
  printWindow.onbeforeunload = (event) => {
    // 이벤트를 취소하여 팝업이 닫히지 않도록 함
    // event.preventDefault();
    closePopup();
    
  };



  // 프린트 다이얼로그가 닫힐 때 현재 창의 내용을 원복
  printWindow.onafterprint = () => {
    printWindow.close();
  };

 
};






const shipImageDownload = () => {

  if (update_form['ship_image_url']) {
    const link = document.createElement("a");
    link.href = update_form['ship_image_url'];
    link.download = "배송완료사진.jpg";
    link.click();
  }
}




export {userOrderModalOpen,userOrderExcelDownload,save,userTable,userOrderSubTable,userOrderFileUpload,shipImageDownload,modalClose, userOrderDelivery,amountAddRow,amountDeleteRow,amountAllDeleteRow,amountSelectDeleteRow}