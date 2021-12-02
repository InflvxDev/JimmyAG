import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InitTsp } from '../../Models/InitTsp';
import { EntrenamientoService } from '../../Services/entrenamiento.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { District } from 'src/app/Models/district';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-entrenamiento-red',
  templateUrl: './entrenamiento-red.component.html',
  styleUrls: ['./entrenamiento-red.component.css']
})
export class EntrenamientoRedComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  datosEntrada : InitTsp;
  fileContent: string;
  vectorDistrict = [];
  constructor(private formBuilder: FormBuilder, private entrenamientoService: EntrenamientoService) {
    this.datosEntrada = new InitTsp();
    this.initGrafica();
   }

  ngOnInit(): void {

  }


  ParamEnt = this.formBuilder.group({
    pop_size: ['',Validators.required],
    elite_size: ['',Validators.required],
    mutation_rate: ['',Validators.required],
    n_generations: ['',Validators.required],
  });

  onReset(){
    this.ParamEnt.reset();
  }

  InicializarAlgoritmo(){


    this.datosEntrada = this.ParamEnt.value;
    this.mapDistricts();
    console.log(this.datosEntrada);
    this.onReset()

    this.entrenamientoService.postinit(this.datosEntrada).subscribe(result =>{
      const progress = result.progress;
      for (let i = 0; i < progress.length; i++) {
        let copy = this.multi;
        copy[0].series.push({ name: i.toString(), value: progress[i] });
        this.multi = [...copy];
      }
      this.mapCoordenada(result.list_best_route[0])
    })
  }

  onChange(event) {
    let file = event.target.files[0];
    let fileReader: FileReader = new FileReader();
    fileReader.readAsText(file);

    let self = this;
    this.vectorDistrict = [];
    fileReader.onload = e => {
      self.fileContent = fileReader.result as string;
      console.log(self.fileContent);

      var rows = self.fileContent.split('\r\n');

      for (var i = 1; i < rows.length; i++) {
        if (rows[i].length != 0) {
          this.vectorDistrict.push(rows[i].split(',').map(Number));
        }
      }
      event.target.value = '';
    };

  }

  mapCoordenada(districs: any[]) {
    let copy2 = this.chartOptions.series;

    for (let i = 0; i < districs.length; i++) {
      copy2[0].data[i] = [districs[i].x,districs[i].y];
      this.chartOptions.series = [...copy2];
    }

    copy2[0].data[districs.length] = [districs[0].x,districs[0].y];
    this.chartOptions.series = [...copy2];
  }

  mapDistricts() {
    this.datosEntrada.list_district = [];
    for (let i = 0; i < this.vectorDistrict.length; i++) {
      this.datosEntrada.list_district.push({
        name: this.vectorDistrict[i][0],
        x: this.vectorDistrict[i][1],
        y: this.vectorDistrict[i][2]
      });
    }
  }

   //-----------------------------------   Grafica  ---------------------------------------------
   view: any[] = [700, 300];

   //options
   legend: boolean = true;
   showLabels: boolean = true;
   animations: boolean = true;
   xAxis: boolean = true;
   yAxis: boolean = true;
   showYAxisLabel: boolean = true;
   showXAxisLabel: boolean = true;
   xAxisLabel: string = 'Generaciones';
   yAxisLabel: string = 'DistanciaOptima';
   xAxisLabel2: string = 'x';
   yAxisLabel2: string = 'y';
   timeline: boolean = true;

   colorScheme = {
     domain: ['#3538e0', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
   };

   multi = [

     {
       "name": "DistanciaGeneracion",
       "series": [
         {
           "name": "0",
           "value": 1
         },

       ]
     }
   ]


   onSelect(data): void {
     console.log('Item clicked', JSON.parse(JSON.stringify(data)));
   }

   onActivate(data): void {
     console.log('Activate', JSON.parse(JSON.stringify(data)));
   }

   onDeactivate(data): void {
     console.log('Deactivate', JSON.parse(JSON.stringify(data)));
   }

  // -------------------------------- Grafica 2 -------------------------------


  initGrafica() {
    this.chartOptions = {
      series: [
        {
          data: [
              [0,0]
          ]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Ruta mas optima",
        align: "left"
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [

        ]
      }
    };
  }


}
