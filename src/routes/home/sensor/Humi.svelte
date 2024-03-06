<script>
    // @ts-nocheck
    
        import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
        import moment from 'moment';
        
        export let dashboard_data ;
    
        let items = dashboard_data['humi'].reverse().slice(0,5);;
       
      </script>
      
    
    
    
    
    
      <Table color="blue" hoverable={true} >
        <TableHead>
          <TableHeadCell>순번</TableHeadCell>
          <TableHeadCell>습도</TableHeadCell>
          <TableHeadCell>생성시간</TableHeadCell>
          
        </TableHead>
        <TableBody class="divide-y">
          {#each items as item,index}
            <TableBodyRow>
              <TableBodyCell>{index+1}</TableBodyCell>
              <TableBodyCell>{Math.floor(item.data * 100) / 100}</TableBodyCell>
              <TableBodyCell>{moment(item.created).format('YYYY-MM-DD HH:mm:ss')}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>