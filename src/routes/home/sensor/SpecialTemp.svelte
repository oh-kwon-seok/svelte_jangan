<script>
    // @ts-nocheck
    
        import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
        import moment from 'moment';
        
        export let dashboard_data ;
    
        let items = dashboard_data['special_temp'];
       
      </script>
      
    
    
    
    
    
      <Table color="purple" hoverable={true} >
        <TableHead>
          <TableHeadCell>순번</TableHeadCell>
          <TableHeadCell>이상온도</TableHeadCell>
          <TableHeadCell>생성시간</TableHeadCell>
          
        </TableHead>
        <TableBody class="divide-y">
          {#each items as item,index}
            <TableBodyRow>
              <TableBodyCell>{index+1}</TableBodyCell>
              <TableBodyCell>{item.data}</TableBodyCell>
              <TableBodyCell>{moment(item.created).format('YYYY-MM-DD HH:mm:ss')}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>