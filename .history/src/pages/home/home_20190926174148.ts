import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ModalPage } from './modal-page';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public feeds: Array<string>;
  private url: string = "https://www.reddit.com/new.json";  

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController) {

    this.fetchContent();

  }

  fetchContent ():void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    this.http.get(this.url).map(res => res.json())
      .subscribe(data => {
        this.feeds = data.data.children;
        loading.dismiss();
      });  
  }


  itemSelected (url: string):void {
    const modal = this.modalCtrl.create(ModalPage);
    modal.present();
  } 
}