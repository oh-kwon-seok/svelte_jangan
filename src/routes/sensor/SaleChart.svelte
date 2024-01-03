

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
  
    ChartJS.register(
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale
    );
    const now_year_color = "#00C3FF";
    const before_year_color = "#52E252";
    
    
    const data : any = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월','8월','9월','10월','11월','12월'],
    datasets: [
      {
        label: '금년 월별 판매실적',
        fill: true,
        lineTension: 0.3,
        backgroundColor: now_year_color,
        borderColor: now_year_color, // 라인 색깔
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(205, 130,1 58)',
        pointBackgroundColor: now_year_color,
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: now_year_color,
        pointHoverBorderColor: now_year_color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40,34, 16, 75, 33, 89],
      },
      {
        label: '전년도 월별 판매실적',
        fill: true,
        lineTension: 0.3,
        backgroundColor: before_year_color,
        borderColor: before_year_color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(35, 26, 136)',
        pointBackgroundColor: before_year_color,
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: before_year_color,
        pointHoverBorderColor: before_year_color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [28, 48, 40, 19, 86, 27, 90,65, 59, 80, 81, 56],
      }
    ],
  };


  </script>
  
  <Line style="height:30vh; width:50vw" {data} options={{responsive: true, }} />

  



