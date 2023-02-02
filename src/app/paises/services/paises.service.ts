import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { Pais } from '../interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private abseUrl='https://restcountries.com/v3.1';  
  private _regiones: string[]= ['Africa','Americas', 'Asia', 'Europe', 'Oceania']
  
  get Regiones(): string[]{
    return [...this._regiones];
  }    
  constructor(private http: HttpClient) { }

  getPaisesPorregion(region: string): Observable<Pais[]>{
    const url=`${this.abseUrl}/region/${region}?fields=name,cca3`;
    return this.http.get<Pais[]>(url);
  }

  getPaisesPorCodigo(pais: string): Observable<Pais>{
    if(!pais){
      return of({ } as Pais);
    }
    console.log('getPaisesPorCodigo', pais);
    const url=`${this.abseUrl}/alpha/${pais}?fields=name,cca3,borders`;
    return this.http.get<Pais>(url);
  }

  getPaisesFrontera(borders: string[]): Observable<Pais[]>
  {
    // if(!borders){
    //   return of([]);
    // }
    console.log('getPaisesFrontera',borders)
    const peticiones: Observable<Pais>[]=[];
    
    if(borders &&   borders?.length!==0){
      borders.forEach(element => {
        const peticion=this.getPaisesPorCodigo(element);
        peticiones.push(peticion);
      });
    return combineLatest(peticiones) ;
    }
    console.log('getPaisesFrontera OF')
    return of([]);

  }
}
