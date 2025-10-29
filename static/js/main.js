document.addEventListener('DOMContentLoaded', () => {

    
    const ctxAccel = document.getElementById('accelChart').getContext('2d');
    const ctxGyro = document.getElementById('gyroChart').getContext('2d');

    const createChartConfig = (title) => {
        return {
            type: 'line', 
            data: {
                labels: [], 
                datasets: [
                    {
                        label: 'Eje X',
                        data: [],
                        borderColor: 'rgba(255, 99, 132, 1)', 
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Eje Y',
                        data: [],
                        borderColor: 'rgba(54, 162, 235, 1)', 
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Eje Z',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)', 
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Muestras' } },
                    y: { title: { display: true, text: 'Valor' } }
                }
            }
        };
    };

    const accelChart = new Chart(ctxAccel, createChartConfig('Acelerómetro'));
    const gyroChart = new Chart(ctxGyro, createChartConfig('Giroscopio'));

    
    async function fetchDataAndUpdateCharts(estado) {
        try {
            const response = await fetch(`/api/data/${estado}`);
            if (!response.ok) {
                throw new Error('Error al cargar los datos');
            }
            
            const data = await response.json();

            accelChart.data.labels = data.labels;
            accelChart.data.datasets[0].data = data.accelerometer.x;
            accelChart.data.datasets[1].data = data.accelerometer.y;
            accelChart.data.datasets[2].data = data.accelerometer.z;
            accelChart.update(); 

            gyroChart.data.labels = data.labels;
            gyroChart.data.datasets[0].data = data.gyroscope.x;
            gyroChart.data.datasets[1].data = data.gyroscope.y;
            gyroChart.data.datasets[2].data = data.gyroscope.z;
            gyroChart.update(); 

        } catch (error) {
            console.error('Hubo un problema:', error);
        }
    }

    
    const selector = document.getElementById('estadoSelector');

    selector.addEventListener('change', (e) => {
        const estadoSeleccionado = e.target.value;
        fetchDataAndUpdateCharts(estadoSeleccionado);
    });

    fetchDataAndUpdateCharts('reposo');

});