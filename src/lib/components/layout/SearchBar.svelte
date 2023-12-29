<script>
  // @ts-nocheck
    import {Breadcrumb,BreadcrumbItem} from 'flowbite-svelte';


    import { Button,Input,Label,Select,Search} from 'flowbite-svelte';
    import { SearchOutline } from 'flowbite-svelte-icons';
    import {common_search_state} from '$lib/store/common/state';
	  import { select_query,selectCustomQuery } from '$lib/store/common/function';
    export let title;
    export let custom;
    export let query;
  
    
    console.log('custom : ',custom);
    console.log('query : ',query);
    
    
</script>





<main>
  <slot />
</main>

<form class="flex gap-2">
  <div class="w-1/5">
    <Label for="first_name" class="mb-2">시작일자</Label>
    <Input   class="border-2 rounded-md p-2" type="date" id="start_date" placeholder="시작일자를 입력하세요" required bind:value={$common_search_state['start_date']}/>

  </div>
  <div class="w-1/5">
    <Label for="first_name" class="mb-2">종료일자</Label>
    <Input   class="border-2 rounded-md p-2" type="date" id="end_date" placeholder="종료일자를 입력하세요" required bind:value={$common_search_state['end_date']}/>

  </div>
  <div class="w-1/5">
    <Label for="first_name" class="mb-2">구분</Label>
    <Select  class="border-2 rounded-md p-2" placeholder="구분을 선택해주세요" items={$common_search_state['filter']} bind:value={$common_search_state['filter_title']}  />
  
  </div>
  <div class="w-2/5">
  <Label for="search" class="mb-2">검색</Label>
    
    <Input  class="border-2 rounded-md p-2" id="search" placeholder="내용을 입력하세요" bind:value={$common_search_state['search_text']}>
    <SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" />


    <Button slot="right" size="sm" type="submit" on:click={()=> custom === true ? selectCustomQuery(title,query) : select_query(title)}>검색</Button>
  
  </Input>
  </div>
  
</form>