
import type { PageLoad } from './$types';

//@ts-ignore
import { cookie_state } from '$lib/store/common/state';






export const load = (({ params}) => {

    if (cookie_state === '' || cookie_state === undefined) {
      return {
        title: 'redirect',
      };
    }
   
 
  // throw error(404, 'Not found');
  
}) satisfies PageLoad;