import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { delay, switchMap, tap } from 'rxjs';
import { Pais } from '../../interfaces/model';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup=this.fb.group({
    region: ['',Validators.required],
    pais: ['',Validators.required],
    frontera: ['', Validators.required],
    
  })

  paises: Pais[]=[];
  fronteras: Pais[]=[];

  cargando: boolean=false;
  constructor(private fb: FormBuilder,
              private paisesService: PaisesService){}


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    //Selección de región
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ )=> {
          this.cargando=true;
          this.miFormulario.get('pais')?.reset('');
        }),
        delay(3000),
        switchMap(region =>
          this.paisesService.getPaisesPorregion(region)
        )
      ).subscribe(
        resp=>{
          console.log(resp);
          this.paises=resp;
          this.cargando=false;
        }
      )
    //Paises
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( ( pais )=> {
          console.log(pais);
          this.miFormulario.get('frontera')?.reset('');
        }),
        switchMap( (pais) => this.paisesService.getPaisesPorCodigo(pais)),
        switchMap( (pais) => this.paisesService.getPaisesFrontera(pais.borders))
      ).subscribe(
        resp=>{
          console.log(resp);
          this.fronteras=resp;
          
        }
      )
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

  get Regiones(): string[]{
    return this.paisesService.Regiones;
  }

  regionValue(region: string): string{
    return region.split(' ')[0].toLocaleLowerCase();
  }

}
