import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public feeds: Array<string>;
  // URL principal API reddit
  private url: string = "https://www.reddit.com/new.json";
  // URL's da API reddit que peda posts velhos e novos
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";



  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    this.fetchContent();
  }

  /*Requisição tipo: GET ao endpoint do Reddit
    +  Loader de feedback ao usuário.*/
  fetchContent(): void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    this.http.get(this.url).map(res => res.json())
      .subscribe(data => {
        if (data) {
          this.feeds = data.data.children;
          console.log(this.feeds);
          loading.dismiss();
        }
      });
  }

  /* Recebe a url como paramerto e inicializa um modal*/
  itemSelected(url: string): void {
    let urlModal = this.modalCtrl.create("UrlModalPage", { urlParam: url });
    urlModal.present();

    urlModal.onDidDismiss(data => {
      console.log(data);
    });
  }

  doInfinite(infiniteScroll) {
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";
    this.http.get(this.olderPosts + paramsUrl).map(res => res.json()).subscribe(data => {
      this.feeds = this.feeds.concat(data.data.children);
      this.feeds.forEach((e, i, a) => {
        if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1) {
          e.data.thumbnail = 'https://www.redditstatic.com/icon.png';
        }
      });
      infiniteScroll.complete();
    });
  }

  doRefresh(refresher) {
    let paramsUrl = this.feeds[0].data.name;
    this.http.get(this.newerPosts + paramsUrl).map(res => res.json()).subscribe(data => {
      this.feeds = data.data.children.concat(this.feeds);
      this.feeds.forEach((e, i, a) => {
        if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1) {
          e.data.thumbnail = 'https://www.redditstatic.com/icon.png';
        }
      });
      refresher.complete();
    });
  }
}