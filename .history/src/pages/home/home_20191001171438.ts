import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, ModalController, ActionSheetController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { RedditServiceProvider } from '../../providers/reddit-service/reddit-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage {

  @ViewChild(Content) private content: Content;

  public feeds: Array<string>;
  // URL principal API reddit
  private url: string = "https://www.reddit.com/new.json";
  // URL's da API reddit que peda posts velhos e novos
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";
  // Guarda a versão integra di array
  public noFilter: Array<any>;
  // Indica se há um filtro ativo
  public hasFilter: boolean = false;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public redditService: RedditServiceProvider) {
    this.fetchContent();
  }

  /*Requisição tipo: GET ao endpoint do Reddit
    +  Loader de feedback ao usuário.*/
  fetchContent(): void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    /** Metodo de requisição */
    // this.http.get(this.url).map(res => res.json())
    //   .subscribe(data => {
    //     if (data) {
    //       this.feeds = data.data.children;
    //       this.noFilter = this.feeds;
    //       console.log(this.feeds);
    //       loading.dismiss();
    //     }
    //   });

    /** Metodo de requisição Usando Provider (RedditServiceProvider) */
    this.redditService.fetchData(this.url).then(data => {
      this.feeds = data;
      this.noFilter = this.feeds;
      loading.dismiss();
    })
  }

  /* Recebe a url como paramerto e inicializa um Modal*/
  itemSelected(url: string): void {
    let urlModal = this.modalCtrl.create("UrlModalPage", { urlParam: url });
    urlModal.present();

    urlModal.onDidDismiss(data => {
      console.log(data);
    });
  }

  /** Atualiza a lista com posts mais antigos usando scroll infinito */
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
      this.noFilter = this.feeds;
      this.hasFilter = false;
    });
  }

  /** Atualiza a lista com posts mais recentes usando refresher */
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
      this.noFilter = this.feeds;
      this.hasFilter = false;
    });
  }

  //Mostrar Filtros
  showFilters(): void {
    
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Filter options:',
      buttons: [
        {
          text: 'AsK Reddit',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
            this.hasFilter = true;
          }
        },
        {
          text: 'Aviation',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "aviation");
            this.hasFilter = true;
          }
        },
        {
          text: 'Memes',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'memes');
            this.hasFilter = true;
          }
        },
        {
          text: 'Europe',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'europe');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });
    actionSheet.present();
  }

  filterItems(){
    this.hasFilter = false;
    this.feeds = this.noFilter.filter((item) => {
      return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
}