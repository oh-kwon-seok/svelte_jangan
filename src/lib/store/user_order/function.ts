

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {user_order_modal_state,user_order_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import { businessNumber,phoneNumber,commaNumber} from '$lib/module/common/function';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';
import { user_form_state } from '../user/state';

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


let init_form_data = {
  uid : 0,
  user : '',
  
  price_status : '미수금',
  order_status : '주문완료',
  description : '**농협 김옥병(453103-56-019411) 오늘도 건강하고 힘나는 하루 되세요**',
  image_url:'',
  ship_image_url:'',
  
  car : '',
  used : 1,

}


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
      user_order_form_state.update(() => init_form_data);
     
    }
    if(title === 'update' ){

        Object.keys(update_form).map((item)=> {    
            if(item === 'car'){
              update_form[item] = data[item]['uid'];
            }else if(item === 'user'){
              update_form[item] = data[item]['id'];
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
            used : param.used,
            auth : 'user',
            user_order_sub : checked_data,
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
         
          ship_image_url : param['ship_image_url'],  
          user_id : param.user,
          car_uid : param.car,
          used : param.used,
          auth : 'user',
          user_order_sub : checked_data,
          token : login_data['token'],

        
        };

        console.log('param : ', param);

      axios.post(url,
        params,
      ).then(res => {
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          user_order_modal_state.update(() => update_modal);
          user_order_form_state.update(()=> init_form_data);
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
              user_order_form_state.update(()=> init_form_data);

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
      let data =  selected_data;

      if(data.length === 0){
        alert['type'] = 'print';
        alert['value'] = true;

        return common_alert_state.update(() => alert);
   
      
      }else{
        printContent(data);    
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




const printContentSub = () => {
  const url = `${api}/user_order_sub/info_select`;
    const params = { user_order_uid : item['uid']};
    const config = {
        params : params,
        headers:{
          "Content-Type": "application/json",
          
        }
      }


    axios.get(url,config).then(res=>{
    
      let user_order_checked_data =  res.data;
    
   const productDetails = user_order_checked_data.length > 0 && user_order_checked_data.map((item2,index2) => `
   
   <tr>
    
     <td >${index2+1}</td>
     <td >${item2.product.name}</td>
     <td >${commaNumber(item2.qty)}</td>
     <td >${commaNumber(item2.price)}</td>
     <td >${commaNumber(item2.supply_price)}</td>
   </tr>
 `).join('');

    });

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
        let user_order_checked_data = res.data;
        const productDetails = user_order_checked_data.length > 0 && user_order_checked_data.map((item2, index2) => `
          <tr>
            <td>${index2 + 1}</td>
            <td>${item2.product.name}</td>
            <td>${commaNumber(item2.qty)}</td>
            <td>${commaNumber(item2.price)}</td>
            <td>${commaNumber(item2.supply_price)}</td>
          </tr>
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
                    font-family: 'Nanum Gothic', sans-serif;
                    margin: 0;
                    padding: 0px 30px 0px 5px;
                    box-sizing: border-box;
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                  }
                  .container {
                    width: 100%;
                    height: 100%;
                  }
                }
              </style>
            </head>
            <body class="page">
              <div class="container">
                후호후호
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Supply Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productDetails}
                  </tbody>
                </table>
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




export {userOrderModalOpen,save,userTable,userOrderSubTable,userOrderFileUpload,shipImageDownload,modalClose}