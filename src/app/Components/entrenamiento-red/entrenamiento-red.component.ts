import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InitTsp } from '../../Models/InitTsp';
import { EntrenamientoService } from '../../Services/entrenamiento.service';

@Component({
  selector: 'app-entrenamiento-red',
  templateUrl: './entrenamiento-red.component.html',
  styleUrls: ['./entrenamiento-red.component.css']
})
export class EntrenamientoRedComponent implements OnInit {
  
  datosEntrada : InitTsp;
  fileContent: string;
  vectorDistrict = [];
  constructor(private formBuilder: FormBuilder, private entrenamientoService: EntrenamientoService) {
    this.datosEntrada = new InitTsp();
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
      console.log(progress);
      let iteraccion : number = 0;
      for (let i = 0; i < progress.length; i++) {
        let copy = this.multi;
        copy[0].series.push({ name: iteraccion.toString(), value: progress[i] });
       this.multi = [...copy];

       iteraccion ++;
      }
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
   xAxisLabel2: string = 'NumeroPatrones';
   yAxisLabel2: string = 'Salidas';
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


}
