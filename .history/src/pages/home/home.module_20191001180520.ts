import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UrlModalPage } from './url-modal';

@NgModule({
  declarations: [
    UrlModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UrlModalPage),
  ],
})
export class HomePageModule {}