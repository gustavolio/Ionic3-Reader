import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
//Operador 'map' da biblioteca rxjs (Stream de dados padão observable)
//Link para entender requisições remotas com observables: https://angular.io/guide/http#!#rxjs
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public feeds: Array<string>;
  private url: string = "https://www.reddit.com/new.json"; //endpoint

  constructor(public navCtrl: NavController, public http: Http) {

    this.http.get(this.url).map(res => res.json())
      .subscribe(data => { 
        this.feeds = data.data.children;
      });
  }

}
