

<script lang='ts'>
    import { Button,Modal} from 'flowbite-svelte';
    import { FireOutline,ImageOutline ,ExclamationCircleOutline} from 'flowbite-svelte-icons';
    import {common_alert_state} from '$lib/store/common/state';
    
   

  export let title : any;
   export let content : any;
   export let color : any;
   export let state : any;

   console.log('state : ', state);
   </script>
   
   
   <Modal bind:open={$common_alert_state['value']} size="xs" >
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{content}</h3>
    
    </div>
  </Modal>


  
    
      <!-- <Alert color={color} dismissable>
        <span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        </span>
        A simple info alert with an <b class="font-semibold  hover:text-red-800 dark:hover:text-red-900">{title}</b>{content}
      </Alert>  -->

   