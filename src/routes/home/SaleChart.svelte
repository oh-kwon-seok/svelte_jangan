

<script lang='ts'>
	
    import { Line } from 'svelte-chartjs';
    import {
      Chart as ChartJS,
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale,
    } from 'chart.js';
    import {onMount,afterUpdate } from 'svelte';

    import axios from 'axios'
    import moment from 'moment';

    const api = import.meta.env.VITE_API_BASE_URL;
    export let dashboard_data : any;
    console.log('dashboard_state : ', dashboard_data);
    


    ChartJS.register(
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale
    );
    const humi_color = "#00C3FF"; // 습도색깔
    const temp_color = "#FF8200"; // 온도색깔
    
  const humi_data : any = {
    labels: dashboard_data['humi_date'],
    datasets: [
     
      {
        label: '습도',
        fill: true,
        lineTension: 0.3,
        backgroundColor: humi_color,
        borderColor: humi_color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(35, 26, 136)',
        pointBackgroundColor: humi_color,
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: humi_color,
        pointHoverBorderColor: humi_color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dashboard_data['humi'],
      }
    ],
  };

  const temp_data : any = {
    labels: dashboard_data['temp_date'],
    datasets: [
     
      {
        label: '온도',
        fill: true,
        lineTension: 0.3,
        backgroundColor: temp_color,
        borderColor: temp_color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#FF0000',
        pointBackgroundColor: temp_color,
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: temp_color,
        pointHoverBorderColor: temp_color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dashboard_data['temp'],
      }
    ],
  };


  </script>
     <Line style="height:30vh; width:30vw" data={temp_data}  />
      <Line style="height:30vh; width:30vw" data={humi_data}  />
   
 
  

  



