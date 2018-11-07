import { Component, OnInit } from '@angular/core';

import { ApiEntriesService } from '../../../shared/services/api-entries.service';
import { NgDataStoreService } from '../../../shared/services/ng-data-store.service';
import { ApiNgUrlsService } from '../../../shared/services/api-ng-urls.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public categories: any[] = [];
  public current: any = {
    id: 0,
    name: '',
    path: '',  // 要らないかも
    updatedAt: '',
    entries: []
  };
  
  constructor(
    private apiEntriesService: ApiEntriesService,
    private apiNgUrlsService: ApiNgUrlsService,
    private ngDataStoreService: NgDataStoreService
  ) { }
  
  public ngOnInit(): void {
    // カテゴリ一覧を取得する (エントリを控えるテーブルからエントリ情報を除いて SELECT する)
    this.apiEntriesService.getCategories()
      .then((categories) => {
        // カテゴリ一覧を控えておく
        this.categories = categories;
        
        // NG URL 一覧を取得する
        return this.apiNgUrlsService.getNgUrls();
      })
      .then((ngUrls) => {
        // NG URL 一覧をサービスに控えておく
        this.ngDataStoreService.ngUrls = ngUrls;
        
        // 「総合 - 人気」を初期表示する
        return this.onShowCategory(this.categories[0]);
      });
  }
  
  public onShowCategory(category: { id: number; name: string; path: string }): void {
    if(category.id === 2) {
      console.log('テストチェック');
      this.apiEntriesService.test();
    }
    
    this.apiEntriesService.getEntries(category.id)
      .then((entryData) => {
        this.current.id   = category.id;
        this.current.name = category.name;
        this.current.path = category.path;
        
        this.current.updatedAt = entryData.updatedAt;
        this.current.entries = entryData.entries
          .filter((entry) => {
            // NG URL 一覧に合致する URL がなかったモノのみ残す
            return !this.ngDataStoreService.ngUrls.find((ngUrl) => {
              return ngUrl === entry.url;
            });
          });
      })
      .catch((error) => {
        // 指定のカテゴリのエントリ取得に失敗
        console.error(error);
      });
  }
  
  public onDeleteEntry(url: string): void {
    this.apiNgUrlsService.addNgUrl(url)
      .then(() => {
        // NG URL 一覧のローカルに追加する
        this.ngDataStoreService.ngUrls.push(url);
        // エントリ一覧から削除する
        this.current.entries = this.current.entries
          .filter((entry) => {
            return entry.url !== url;
          });
      });
  }
}
