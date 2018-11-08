import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiEntriesService } from '../../../shared/services/api-entries.service';
import { ApiNgUrlsService } from '../../../shared/services/api-ng-urls.service';
import { LogoutService } from '../../../shared/services/logout.service';
import { CategoriesService } from '../../../shared/services/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** カテゴリ一覧 */
  public categories: any[] = [];
  
  /** 表示中のカテゴリのデータ */
  public current: any = {
    id: 0,
    /** カテゴリ名 */
    name: '',
    /** 要らない？ */
    path: '',
    /** 最終クロール日時 */
    updatedAt: '',
    /** エントリ一覧 */
    entries: []
  };
  
  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private apiEntriesService: ApiEntriesService,
    private apiNgUrlsService: ApiNgUrlsService,
    private logoutService: LogoutService
  ) { }
  
  public ngOnInit(): void {
    // カテゴリ一覧を取得する (エントリを控えるテーブルからエントリ情報を除いて SELECT する)
    this.categoriesService.findAll()
      .then((categories) => {
        // カテゴリ一覧をメニューとして表示する
        this.categories = categories;
        
        // TODO : NG 情報を取得する
        
        // 
        return this.onShowCategory(this.categories[0].id);
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
            return !/*this.ngDataStoreService.ngUrls*/['test'].find((ngUrl) => {
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
        // this.ngDataStoreService.ngUrls.push(url);
        // エントリ一覧から削除する
        this.current.entries = this.current.entries
          .filter((entry) => {
            return entry.url !== url;
          });
      });
  }
  
  public onLogout(): void {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }
}
