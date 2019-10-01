import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RedditServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RedditServiceProvider {

  private feeds: Array<any>;

  constructor(public http: HttpClient) {
    console.log('Hello RedditServiceProvider Provider');
  }


  fetchData(url: string): Promise<any> {
    return new Promise(resolve => {
      this.http.get(url).map(res => res.json())
        .subscribe(data => {
          console.log(res);
          this.feeds = data.data.children;
          this.feeds.forEach((e, i, a) => {
            if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1) {
              e.data.thumbnail = 'https://www.redditstatic.com/icon.png';
            }
          })
          resolve(this.feeds);
        }, err => console.log(err));
    });
  }

}
