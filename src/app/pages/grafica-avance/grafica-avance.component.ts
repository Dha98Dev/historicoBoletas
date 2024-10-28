import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-grafica-avance',
  templateUrl: './grafica-avance.component.html',
  styleUrls: ['./grafica-avance.component.css']
})
export class GraficaAvanceComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  constructor() {
    // Inicializamos chartOptions
    this.chartOptions = {
      title: { text: 'Avance Diario y Acumulado de Captura de Boletas' },
      xAxis: { type: 'datetime', title: { text: 'Fecha' } },
      yAxis: { title: { text: 'Total de Boletas' } },
      series: [
        {
          type: 'line',
          data: [], // Inicializamos el array vacío para el avance diario
          name: 'Boletas Capturadas por Día'
        },
        {
          type: 'line',
          data: [], // Inicializamos el array vacío para el acumulado
          name: 'Total Acumulado de Boletas'
        }
      ]
    };

    // Datos de ejemplo
    const datosCaptura = [
      { fecha: '2024-10-15', total_boletas: 20 },
      { fecha: '2024-10-16', total_boletas: 30 },
      { fecha: '2024-10-17', total_boletas: 25 }
    ];

    // Convierte los datos en el formato adecuado para Highcharts
    const dataSeries = datosCaptura.map(item => [
      new Date(item.fecha).getTime(), // convierte la fecha a timestamp
      item.total_boletas
    ]);

    // Cálculo del total acumulado
    let acumulado = 0;
    const acumuladoSeries = datosCaptura.map(item => {
      acumulado += item.total_boletas;
      return [new Date(item.fecha).getTime(), acumulado];
    });

    // Asignamos los datos a las series
    (this.chartOptions.series![0] as Highcharts.SeriesLineOptions).data = dataSeries; // Avance por día
    (this.chartOptions.series![1] as Highcharts.SeriesLineOptions).data = acumuladoSeries; // Acumulado
  }
}
