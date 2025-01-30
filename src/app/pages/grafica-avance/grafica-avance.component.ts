import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GetInfoGraficasService } from '../../services/get-info-graficas.service';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { avanceCapturistas, avanceEstado, avancePorTiempo } from '../../interfaces/graficas.interface';
import { GetNombreService } from '../../services/get-nombre.service';

@Component({
  selector: 'app-grafica-avance',
  templateUrl: './grafica-avance.component.html',
  styleUrls: ['./grafica-avance.component.css']
})
export class GraficaAvanceComponent {
private avanceSemanal:avancePorTiempo[]=[]
private avanceMensual:avancePorTiempo[]=[]
private avanceCapturistas:avanceCapturistas[]=[]
private avanceEstado:avanceEstado[]=[]
public totalboletas:number=0
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options={};
  chartOptionsMensual: Highcharts.Options={};
  chartOptionsCapturistas: Highcharts.Options={};
  chartOptionsEstados: Highcharts.Options={};

public updateFlag:boolean = false;
  constructor(private graficasService:GetInfoGraficasService, private userService:userService,  private tituloPagina:GetNombreService) {

    // Inicializamos chartOptions
    // this.chartOptions = {
    //   title: { text: 'Avance Diario y Acumulado de Captura de Boletas' },
    //   xAxis: { type: 'datetime', title: { text: 'Fecha' } },
    //   yAxis: { title: { text: 'Total de Boletas' } },
    //   series: [
    //     {
    //       type: 'line',
    //       data: [], // Inicializamos el array vacío para el avance diario
    //       name: 'Boletas Capturadas por Día'
    //     },
    //     {
    //       type: 'line',
    //       data: [], // Inicializamos el array vacío para el acumulado
    //       name: 'Total Acumulado de Boletas'
    //     }
    //   ]
    // };

    // // Datos de ejemplo
    // const datosCaptura = [
    //   { fecha: '2024-10-15', total_boletas: 20 },
    //   { fecha: '2024-10-16', total_boletas: 30 },
    //   { fecha: '2024-10-17', total_boletas: 25 }
    // ];

    // // Convierte los datos en el formato adecuado para Highcharts
    // const dataSeries = datosCaptura.map(item => [
    //   new Date(item.fecha).getTime(), // convierte la fecha a timestamp
    //   item.total_boletas
    // ]);

    // // Cálculo del total acumulado
    // let acumulado = 0;
    // const acumuladoSeries = datosCaptura.map(item => {
    //   acumulado += item.total_boletas;
    //   return [new Date(item.fecha).getTime(), acumulado];
    // });

    // // Asignamos los datos a las series
    // (this.chartOptions.series![0] as Highcharts.SeriesLineOptions).data = dataSeries; // Avance por día
    // (this.chartOptions.series![1] as Highcharts.SeriesLineOptions).data = acumuladoSeries; // Acumulado
  }

  ngOnInit(){

    this.tituloPagina.setNombre='Avance De Captura'

    this.getInfoGraficas()

    this.chartOptions = {
      title: { text: 'Avance por semana y Acumulado de Captura de Boletas' },
      xAxis: { 
        categories: [], // Inicializamos con un array vacío para las semanas
        title: { text: 'Numero de la Semana en la que fue capturada' }
      },
      yAxis: { title: { text: 'Total de Boletas' } },
      series: [
        {
          type: 'line',
          data: [], // Inicializamos el array vacío para el avance semanal
          name: 'Boletas Capturadas por Semana',
          color: this.generarColorAleatorio()
        },
        {
          type: 'line',
          data: [], // Inicializamos el array vacío para el acumulado
          name: 'Total Acumulado de Boletas',
          color:this.generarColorAleatorio()
        }
      ]
    };

    this.chartOptionsMensual = {
      title: { text: 'Avance mensual y Acumulado de Captura de Boletas' },
      xAxis: { 
        categories: [], // Inicializamos con un array vacío para las semanas
        title: { text: 'Numero de Boletas Capturadas por mes' }
      },
      yAxis: { title: { text: 'Total de Boletas' } },
      series: [
        {
          type: 'column',
          data: [], // Inicializamos el array vacío para el avance semanal
          name: 'Boletas Capturadas mes',
        },
        {
          type: 'line',
          data: [], // Inicializamos el array vacío para el acumulado
          name: 'Total Acumulado de Boletas',
        }
      ]
    };

    this.chartOptionsCapturistas = {
      title: { text: 'Avance de Captura agrupado por Capturista' },
      xAxis: { 
        categories: [], // Inicializamos con un array vacío para las semanas
        title: { text: 'Numero de boletas capturadas ordenadas por Capturista' }
      },
      yAxis: { title: { text: 'Total de Boletas' } },
      series: [
        {
          type: 'column',
          data: [], // Inicializamos el array vacío para el avance semanal
          name: 'Boletas agrupadas por capturistas',
        },
        {
          type: 'line',
          data: [], // Inicializamos el array vacío para el acumulado
          name: 'Total Acumulado de Boletas',
        }
      ]
    };
    this.chartOptionsEstados = {
      chart: {
          type: 'pie', // Usamos 'pie' para crear un gráfico donut
          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          }
      },
      title: {
          text: 'Relacion de boletas que fueron revisadas y verificadas'
      },
      plotOptions: {
          pie: {
              innerSize: '50%', // Hace que el gráfico sea un donut
              dataLabels: {
                  enabled: true,
                  format: '{point.name}: {point.y}'
              }
          }
      },
      series: [{
          type: 'pie', // Especificar el tipo de serie aquí
          name: 'Total de Boletas',
          data: [] // Inicialmente vacío, se llenará después
      }]
  };
  

  }

  getInfoGraficas(){
    let data ={token: this.userService.obtenerToken()}
    this.graficasService.getInfoGraficas(data).subscribe(response =>{
      if(!response.error){
        this.avanceSemanal=response.data['avanceSemanal']
        this.avanceMensual=response.data['avanceMensual']
        this.avanceCapturistas=response.data['avanceCapturistas']
        this.avanceEstado=response.data['estadosDeBoleta']
        this.totalboletas=response.data['totalBoletasRegistradas']
        console.log(this.avanceEstado)
        this.inicializarGraficaSemanal()

        this.avanceMensual.forEach(item => {
          const [year, month] = item.periodo.split("-").map(Number);
          const fecha = new Date(year, month - 1);
      
          // Formatear el nombre del mes y año en español
          const nombreMes = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(fecha);
          
          // Actualizar el campo "periodo" con el nombre del mes capitalizado
          item.periodo = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
      });

        this.inicializarGraficaCapturistas()
        this.inicializarGraficaMensual()
        this.inicializarGraficaEstado()
      }
      else{
        console.log("Ocurrio un error al realizar la peticion")
      }
    })
  }
  inicializarGraficaSemanal(){
    // Extraemos las categorías (números de semana) para el eje X y los datos de captura semanal
    const categoriasSemanas = this.avanceSemanal.map(item => item.periodo);
    const dataSeries = this.avanceSemanal.map(item => item.total_boletas);
    
    for (let i = 0; i < categoriasSemanas.length; i++) {
      const element = categoriasSemanas[i].replace('Semana numero', 'Semana');
      categoriasSemanas[i] = element;
    }
    
    console.log(categoriasSemanas)

    

    // Cálculo del total acumulado
    let acumulado = 0;
    const acumuladoSeries = this.avanceSemanal.map(item => {
      acumulado += item.total_boletas;
      return acumulado;
    });
    
    // Asignamos las categorías y datos a las series
    (this.chartOptions.xAxis as Highcharts.XAxisOptions).categories = categoriasSemanas;
    (this.chartOptions.series![0] as Highcharts.SeriesLineOptions).data = dataSeries; // Avance semanal
    (this.chartOptions.series![1] as Highcharts.SeriesLineOptions).data = acumuladoSeries; // Acumulado
    
    // Forzamos la actualización del gráfico
    this.updateFlag = true;
  }
  
  inicializarGraficaMensual() {
    // Extraemos las categorías (meses) para el eje X
    const categoriasMes = this.avanceMensual.map(item => item.periodo);
    
  
    // Generar el array de datos con colores aleatorios
    const dataSeries = this.avanceMensual.map(item => ({
        y: item.total_boletas,
        color: this.generarColorAleatorio() // Genera un color aleatorio para cada dato
    }));

    // Cálculo del total acumulado
    let acumulado = 0;
    const acumuladoSeries = this.avanceMensual.map(item => {
        acumulado += item.total_boletas;
        return acumulado;
    });

    // Asignamos las categorías y datos a las series
    (this.chartOptionsMensual.xAxis as Highcharts.XAxisOptions).categories = categoriasMes;
    (this.chartOptionsMensual.series![0] as Highcharts.SeriesLineOptions).data = dataSeries; // Avance mensual
    (this.chartOptionsMensual.series![1] as Highcharts.SeriesLineOptions).data = acumuladoSeries; // Acumulado

    // Forzamos la actualización del gráfico
    this.updateFlag = true;
}

// Método para inicializar el gráfico
inicializarGraficaCapturistas() {
  // Extraemos las categorías (nombres de los capturistas) para el eje X
  const categoriasCapturistas = this.avanceCapturistas.map(item => item.capturador);

  // Generar el array de datos con colores aleatorios
  const dataSeries = this.avanceCapturistas.map(item => ({
      y: item.total_boletas,
      color: this.generarColorAleatorio() // Genera un color aleatorio para cada dato
  }));

  // Cálculo del total acumulado
  let acumulado = 0;
  const acumuladoSeries = this.avanceCapturistas.map(item => {
      acumulado += item.total_boletas;
      return acumulado; // Retorna el total acumulado hasta este punto
  });

  // Asignamos las categorías y datos a las series
  (this.chartOptionsCapturistas.xAxis as Highcharts.XAxisOptions).categories = categoriasCapturistas;
  (this.chartOptionsCapturistas.series![0] as Highcharts.SeriesColumnOptions).data = dataSeries; // Total de boletas

  // Asignamos el total acumulado a la segunda serie
  (this.chartOptionsCapturistas.series![1] as Highcharts.SeriesLineOptions).data = acumuladoSeries; // Total acumulado

  // Forzamos la actualización del gráfico
  this.updateFlag = true;
}
inicializarGraficaEstado() {
  // Asegúrate de que this.avanceEstado esté definido antes de usarlo
  const dataSeries = this.avanceEstado.map(item => ({
      name: item.estado,
      y: item.total_boletas,
      color: this.generarColorAleatorio() // Genera un color aleatorio para cada dato
  }));

  // Verificamos si series y series[0] están definidos
  if (this.chartOptionsEstados.series && this.chartOptionsEstados.series.length > 0) {
      (this.chartOptionsEstados.series[0] as Highcharts.SeriesPieOptions).data = dataSeries;

      // Forzamos la actualización del gráfico
      this.updateFlag = true;
  } else {
      console.error("La serie no está definida.");
  }
}




  generarColorAleatorio(): string {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
}




}
