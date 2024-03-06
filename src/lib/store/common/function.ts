// @ts-nocheck


import { writable } from 'svelte/store';
import {common_alert_state,common_toast_state, menu_state,url_state,load_state,common_search_state,login_state,common_product_state,  common_car_state,common_company_state,common_user_state,common_user_order_state,common_user_order_sub_state,table_state,common_type_state } from './state';

// import {item_data,item_form_state} from '$lib/store/info/item/state';

import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';

import axios from 'axios';
import {v4 as uuid} from 'uuid';
import Excel from 'exceljs';
import moment from 'moment';


import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { removeCookie } from '$lib/cookies';

const api = import.meta.env.VITE_API_BASE_URL;
const client_url = import.meta.env.VITE_CLIENT_BASE_URL;



    
let alert_data : any;
let toast_data : any;
// let item_form_data : any;
let load_data : any;
let menu_data : any;
let search_data : any;
let list_data : any;
let login_data : any;
let url_data : any;

let table_data : any;

let product_data : any;

let car_data : any;

let type_data : any;


let company_data : any;

let user_data : any;

let user_order_data : any;

let user_order_sub_data : any;

const workbook = new Excel.Workbook();



common_alert_state.subscribe((data : any) => {
  alert_data = data;
})

common_toast_state.subscribe((data : any) => {
  toast_data = data;
})

load_state.subscribe((data : any) => {
  load_data = data;
})

menu_state.subscribe((data : any) => {
  menu_data = data;
})

url_state.subscribe((data : any) => {
  url_data = data;
})


common_search_state.subscribe((data : any) => {
    search_data = data;
})

login_state.subscribe((data) => {
  login_data = data;

})

table_state.subscribe((data : any) => {
  table_data = data;
})


common_product_state.subscribe((data : any) => {
  product_data = data;
})


common_car_state.subscribe((data : any) => {
  car_data = data;
})
common_type_state.subscribe((data : any) => {
  type_data = data;
})


common_company_state.subscribe((data) => {
  company_data = data;

})

common_user_state.subscribe((data) => {
  user_data = data;

})

common_user_order_state.subscribe((data : any) => {
  user_order_data = data;
})

common_user_order_sub_state.subscribe((data : any) => {
  user_order_sub_data = data;
})


const init_login_data : any = {
  user_idx : "",
  id : "",
  name : "",
  password : "",
  token :"",

  status : false,
  
};





const infoCallApi = (title) => {

 
  const url = `${api}/${title}/info_select`; 
  console.log();

  const config = {
    headers:{
      "Content-Type": "application/json",
      
    }
  }

  try {
    axios.get(url,config).then(res=>{
   
  
      if(res.data.length > 0){
        if(title === 'car'){
          car_data = res.data;
          common_car_state.update(()=> car_data);
        
        }else if(title === 'user'){
          user_data = res.data;
          common_user_state.update(()=> user_data);
        
        }else if(title === 'company'){
          console.log('resdata : ', res.data);
          company_data = res.data;
          common_company_state.update(()=> company_data);
        
        }else if(title === 'type'){
          type_data = res.data;
          common_type_state.update(()=> type_data);
        
        }
      

      }else {
      
      }
   })
  }catch(e){
    console.log('e',e);
  } finally {
    console.log('final : ');
  }
  }



 


  const logout = () => {
    var confirmLogout = confirm("로그아웃하시겠습니까?");

    if (confirmLogout) {
        // 여기에 로그아웃 로직을 추가하세요.
        login_data = init_login_data;
        console.log('init_login_data : ', init_login_data);
        removeCookie('my-cookie');
        removeCookie('password');
        removeCookie('autoSave');
      
        window.location.href = client_url;

        login_state.update(()=> login_data);
    
    } else {
        // 사용자가 '취소'를 선택한 경우
      
    }
    }






const changeUrl = (obj) => {
  
  
  
  url_data['path'] =obj['path'];
  url_data['query'] =obj['query'];

  console.log('url_data',url_data);
  
  url_state.update(()=> url_data);


  }



  const commonCloseAlert = (state) => {
   
    alert_data = {type : state, value : false} 

    
    common_alert_state.update(()=> alert_data);
  
    }

    const commonCloseToast = (state) => {
   
      toast_data = {type : state, value : false, counter : 4} 
  
      
      common_toast_state.update(()=> toast_data);
    
      }




const onChangeHandler = (e) => {
  let title = e.target.name;
  login_data[title] = e.target.value;
  login_state.update(()=> login_data);

  }
  const tokenChange = (token) => {
    
    login_data['token'] = token;
    login_state.update(()=> login_data);
  
  
    }


  const handleToggle = (title) => {
   
    console.log('title', title);
    
    menu_data[title] = !menu_data[title];
    menu_state.update(()=> menu_data);
  
    
    }


    const loadChange = (param) => {
      load_data = param;
      load_state.update(()=> load_data);
      
    }
const onSearchHandler = (e : any) => { 

    search_data['search_text'] = e.target.value;
    
    console.log('e.target.value',e.target.value);
    // if(search_data['type'] === 'all'){
    //   search_data['filteredItems'] = list_data.filter((item) => item['maker'].indexOf(search_data['search_text'].toLowerCase()) !== -1 || item['name'].indexOf(search_data['search_text'].toLowerCase()) !== -1)
    // }else {
    //   search_data['filteredItems'] = list_data.filter((item) => item[search_data['type']].indexOf(search_data['search_text'].toLowerCase()) !== -1);
    // }
    
    
    common_search_state.update(()=> search_data);
   
}


const cellClick = (data, key,value) => {
      
  if(key === 'expand' || key === 'check' ){
    for(let i =0; i<data.length; i++){
      if(value === data[i].code){
        
        data[i][key] = !data[i][key];
        break;
      }
    }

  }
  
  search_data['filteredItems'] = data;
  common_search_state.update(()=> search_data);
}

const rowClick = (data, key,value) => {
      
  if(key === 'select' ){
    for(let i =0; i<data.length; i++){
      if(data[i]['select'] === true){
        data[i][key] = !data[i][key];

      }
      if(value === data[i].code){
        
        data[i][key] = !data[i][key];
       
      }
    }

  }
  
  search_data['filteredItems'] = data;
  common_search_state.update(()=> search_data);
}

const allCheckClick = (data, key,value) => {
      
  if(key === 'check'){
    for(let i =0; i<data.length; i++){
        data[i][key] = !value;
    }
  }
  
  search_data['all_check'] = !value;
  search_data['filteredItems'] = data;
  common_search_state.update(()=> search_data);
}

const check_delete = (data, key,value) => {
      
  let setData = data.filter(item => item.check === false);


  search_data['filteredItems'] = setData;
   search_data['all_check'] = false;
  common_search_state.update(()=> search_data);
}




const excelDownload = (type,config) => {
  
      let data =  table_data[type].getSelectedData();
      console.log('data  : ', table_data[type].getSelectedData());
      
      
      
      if(data.length > 0){
        // 모든 객체에서 공통된 키(key) 이름을 찾기 위한 반복문
        for (let i = 0; i <  data.length; i++) {
          let currentObject =  data[i];

          Object.keys(currentObject).map((key)=> {    

            if(typeof currentObject[key] === 'object' && currentObject[key] !== null){
            
              data[i][key] = currentObject[key]['name'];
            }

            // console.log(typeof currentObject[key], key,currentObject[key]);

            // if(typeof currentObject[key] === "object"){
            //   console.log('currentObject : ',currentObject[key]);
            //   data[i][key] = currentObject[key]['name'];
            // }
          
          }); 
        }

        try {

          let text_title : any= '';
          switch(type){
              case 'product': 
                  text_title = '품목 관리';
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


  const fileButtonClick = (id) => {

    try {
      let myInput : any = document.getElementById(id);
      myInput.click();
    } catch(error) {
      console.error(error);
    }
  }

 


  const excelUpload = (e,config) => {
    
    const wb = new Excel.Workbook();
    const reader = new FileReader()

    let file = e.target.files[0];

    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      let change_data = [];
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        console.log(workbook, 'workbook instance')
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow((row, rowIndex) => {
            console.log(row.values, rowIndex);
            if(rowIndex > 1){
            let obj = {

            };
            for(let i=0; i<config.length; i++){
              obj[config[i].key] = row.values[i+1];

            }
            obj['expand'] = false;
            obj['check'] = false;
            change_data.push(obj);

            list_data = change_data;
          }else {

          }
           

           

          
          });
          // item_data.update(() => list_data);
          search_data['filteredItems'] = list_data;
          common_search_state.update(() => search_data);
          
       

        })
      })
     
    }
   
  }

  const minMaxFilterFunction = (headerValue, rowValue, rowData, filterParams) => {
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property
    
        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }
    
    return true; //must return a boolean, true if it passes the filter.
    }


      const minMaxFilterEditor = (cell, onRendered, success, cancel, editorParams) =>{

      var end;
      
      var container = document.createElement("span");
      
      //create and style inputs
      var start = document.createElement("input");
      start.setAttribute("type", "number");
      start.setAttribute("placeholder", "Min");
      start.setAttribute("min", 0);
      start.setAttribute("max", 100);
      start.style.padding = "4px";
      start.style.width = "50%";
      start.style.boxSizing = "border-box";
      
      start.value = cell.getValue();
      
      function buildValues(){
          success({
              start:start.value,
              end:end.value,
          });
      }
      
      function keypress(e){
          if(e.keyCode == 13){
              buildValues();
          }
      
          if(e.keyCode == 27){
              cancel();
          }
      }
      
      end = start.cloneNode();
      end.setAttribute("placeholder", "Max");
      
      start.addEventListener("change", buildValues);
      start.addEventListener("blur", buildValues);
      start.addEventListener("keydown", keypress);
      
      end.addEventListener("change", buildValues);
      end.addEventListener("blur", buildValues);
      end.addEventListener("keydown", keypress);
      
      
      container.appendChild(start);
      container.appendChild(end);
      
      return container;
      }



      const select_query = (type) => {
   
        const url = `${api}/${type}/select`; 
              
        search_data['filter'] = TABLE_FILTER[type];
        
        common_search_state.update(() => search_data);

        let start_date = moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');

        let end_date = moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');
        let search_text = search_data['search_text'];
        let filter_title = search_data['filter_title'];
        

        

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
            console.log('url : ',url);
            console.log('select_query : ',res);
            console.log('table_data : ',table_data);
            console.log('type : ', type);
            console.log('params : ', params);
            
            table_data[type].setData(res.data);
            table_state.update(() => table_data);
           
         })
      
      }




      const makeTable = (table_state,type,tableComponent) => {
       

   
        const url = `${api}/${type}/select`; 
        
        search_data['filter'] = TABLE_FILTER[type];
        
        common_search_state.update(() => search_data);

        let start_date = moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');

        let end_date = moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');
        let search_text = search_data['search_text'];
        let filter_title = search_data['filter_title'];
      

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
            
            console.log('makeTable : ',res);
         
           
            if(res.data.length > 0){
             
              if(table_state[type]){
                table_state[type].destory();
              }

              
              table_data[type] =   new Tabulator(tableComponent, {
              height:TABLE_TOTAL_CONFIG['height'],
              layout:TABLE_TOTAL_CONFIG['layout'],
              pagination:TABLE_TOTAL_CONFIG['pagination'],
              paginationSize: type==='user_order' ? 500 : TABLE_TOTAL_CONFIG['paginationSize'],
              paginationSizeSelector: TABLE_TOTAL_CONFIG['paginationSizeSelector'],
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
              },
           

              data : res.data,
            
              columns: TABLE_HEADER_CONFIG[type],
              
         
             
              });
              console.log('table_data  :', table_data);

              table_state.update(()=> table_data);

          
            
              
        }else{
          
          if(table_state[type]){
            table_state[type].destory();
          }

          table_data[type] =   new Tabulator(tableComponent, {
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

        
      const makeCustomTable = (table_state,type,tableComponent,select) => {


        console.log(table_state);
        console.log(type);
        console.log(tableComponent);
        
        const url = `${api}/${type}/${select}`; 
        
        search_data['filter'] = TABLE_FILTER[type];
        
        common_search_state.update(() => search_data);
       let start_date= moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');
       let end_date= moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');;
       
      
       
       
        let search_text = search_data['search_text'];
        let filter_title = search_data['filter_title'];
      

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
            
            console.log('makeTable : ',res);
            console.log('url : ',url);
         
           
            if(res.data.length > 0){
             
              if(table_state[type]){
                table_state[type].destory();
              }

              
              table_data[type] =   new Tabulator(tableComponent, {
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
             

              rowClick:function(e, row){
                //e - the click event object
                //row - row component
             
                row.toggleSelect(); //toggle row selected state on row click
            },

              rowFormatter:function(row){
                    row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
              },
           

              data : res.data,
            
              columns: TABLE_HEADER_CONFIG[type],
              
         
             
              });
              console.log('table_data  :', table_data);

              table_state.update(()=> table_data);

          
            
              
        }else{
          
          if(table_state[type]){
            table_state[type].destory();
          }

          table_data[type] =   new Tabulator(tableComponent, {
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


    const selectCustomQuery = (type,select) => {
   
      const url = `${api}/${type}/${select}`; 

      console.log('url : ', url);
            
      search_data['filter'] = TABLE_FILTER[type];
      
      common_search_state.update(() => search_data);

      let start_date = moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');

      let end_date = moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');

      console.log('start_date: ',start_date);
      console.log('end_date: ',end_date);
      
      let search_text = search_data['search_text'];
      let filter_title = search_data['filter_title'];
      

      

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
          console.log('res.data : ',res);
          
          table_data[type].setData(res.data);
          table_state.update(() => table_data);
         
       })
    
    }







   


export {handleToggle, 
  onChangeHandler, 
  onSearchHandler,
  excelDownload,
  excelUpload,
  fileButtonClick, 
  allCheckClick, 
  cellClick, 
  rowClick, 
  check_delete, 
  changeUrl,
  loadChange,
  commonCloseAlert,
  commonCloseToast,
  infoCallApi,
  minMaxFilterFunction,
  minMaxFilterEditor,
  makeTable,
  makeCustomTable,
  tokenChange,
  select_query,
  selectCustomQuery,
  logout
}