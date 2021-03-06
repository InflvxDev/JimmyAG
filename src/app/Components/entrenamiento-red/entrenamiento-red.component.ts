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
} from 'ng-apexcharts';
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

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public _chartOptions: Partial<ChartOptions>;

  datosEntrada: InitTsp;
  fileContent: string;
  vectorDistrict = [];

  constructor(private formBuilder: FormBuilder, private entrenamientoService: EntrenamientoService) {
    this.datosEntrada = new InitTsp();
    this.initGrafica();
    this._initGrafica();
  }

  ngOnInit(): void {

  }


  ParamEnt = this.formBuilder.group({
    pop_size: ['', Validators.required],
    elite_size: ['', Validators.required],
    mutation_rate: ['', Validators.required],
    n_generations: ['', Validators.required],
  });

  onReset() {
    this.ParamEnt.reset();
  }

  InicializarAlgoritmo() {


    this.datosEntrada = this.ParamEnt.value;
    this.mapDistricts();
    console.log(this.datosEntrada);
    this.onReset()

    this.entrenamientoService.postinit(this.datosEntrada).subscribe(result => {
      const progress = result.progress;
      console.log(progress);

      // for (let i = 0; i < progress.length; i++) {
      //   let copy = this.multi;
      //   copy[0].series.push({ name: i.toString(), value: progress[i] });
      //   this.multi = [...copy];
      // }

      this.mapProgress(result.progress).then(() => {
      });


      this.mapCoordenada(result.list_best_route);
    })
  }

  private async showCoordenada(value: number[]): Promise<number[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 100);
    });
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

  private async showProgress(value: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 100);
    });
  }

  async mapProgress(progress: number[]): Promise<void> {
    let copy2 = this._chartOptions.series;
    let copy3 = this._chartOptions.xaxis;

    for (let i = 0; i < progress.length; i++) {
      copy2[0].data[i] = await this.showProgress(progress[i]);

      copy3.categories[i] = i;
      this._chartOptions.xaxis = copy3;
      this._chartOptions.series = [...copy2];

    }
  }

  private async mapNewCoords(districs: any[]): Promise<any[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(districs);
      }, 100);
    });
  }

  async mapCoordenada(districs: any[]) {
    let copy2 = this.chartOptions.series;

    for (let i = 0; i < districs.length; i++) {
      const coords = await this.mapNewCoords(districs[i]);
      for (let j = 0; j < coords.length; j++) {
        copy2[0].data[j] = [coords[j].x, coords[j].y];
        this.chartOptions.series = [...copy2];
      }

      copy2[0].data[coords.length] = [coords[0].x, coords[0].y];
      this.chartOptions.series = [...copy2];
    }
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
      'name': 'DistanciaGeneracion',
      'series': [
        {
          'name': '0',
          'value': 1
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
            [0, 0]
          ]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Ruta mas optima',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: []
      }
    };
  }

  _initGrafica() {
    this._chartOptions = {
      series: [
        {
          data: [
            0
          ]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Generaciones VS Distancias',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          0
        ]
      }
    };
  }


}
