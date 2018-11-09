import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { LogoutService } from '../../../shared/services/logout.service';
import { CategoriesService } from '../../../shared/services/categories.service';
import { Category } from '../../../shared/classes/category';
import { NgDataService } from '../../../shared/services/ng-data.service';
import { Entry } from '../../../shared/classes/entry';

/**
 * Home Component : 「ホーム」画面
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** カテゴリ一覧 */
  public categories: Category[] = [];
  
  /** 表示中のカテゴリのデータ */
  public currentCategory: Category = null;
  
  // TODO : コメント
  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private ngDataService: NgDataService,
    private logoutService: LogoutService,
    private httpClient: HttpClient
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // カテゴリ一覧を取得する
    this.categoriesService.findAll()
      .then((categories) => {
        // カテゴリ一覧をメニューとして表示する
        this.categories = categories;
        
        // NG 情報を取得し、サービス自身に蓄えサさせておく
        return this.ngDataService.findAll();
      })
      .then((_ngData) => {
        // このクラス内では NG 情報をキャッシュしたりしない
        // 「総合 - 人気」の記事を取得する
        return this.onShowCategory(1);
      })
      .catch((error) => {
        console.error('エラー', error);
      });
  }
  
  /**
   * カテゴリ別の記事一覧を取得する
   * 
   * @param categoryId カテゴリ ID
   */
  public onShowCategory(categoryId: string | number): void {
    this.categoriesService.findById(categoryId)
      .then((category) => {
        // NG 情報を参照して除外していく : filter() をチェーンしたりできるが、デバッグしやすくするため分割しておく
        console.log('フィルタ前', category.entries.length, category.entries);
        
        const urlFilteredEntries = category.entries.filter((entry) => {
          // 記事 URL が NG URL に合致する記事を省く
          return !this.ngDataService.ngUrls.some((ngUrl) => {
            return entry.url === ngUrl.url;
          });
        });
        console.log('URL フィルタ後', urlFilteredEntries.length, urlFilteredEntries);
        
        const wordFilteredEntries = urlFilteredEntries.filter((entry) => {
          // NG ワードをタイトルに含む記事を省く
          return !this.ngDataService.ngWords.some((ngWord) => {
            return entry.title.includes(ngWord.word);
          });
        });
        console.log('ワードフィルタ後', wordFilteredEntries.length, wordFilteredEntries);
        
        const domainFilteredEntries = wordFilteredEntries.filter((entry) => {
          // NG ドメインを URL に含む記事を省く
          return !this.ngDataService.ngDomains.some((ngDomain) => {
            return entry.url.includes(ngDomain.domain);
          });
        });
        console.log('ドメインフィルタ後', domainFilteredEntries.length, domainFilteredEntries);
        
        // 画面に設定する
        category.entries = domainFilteredEntries;
        this.currentCategory = category;
      })
      .catch((error) => {
        // 指定のカテゴリのエントリ取得に失敗
        console.error(error);
      });
  }
  
  /**
   * 選択した記事を NG URL に追加して削除する
   * 
   * @param entry 削除する記事
   */
  public onDeleteEntry(entry: Entry): void {
    // TODO
  }
  
  /**
   * ログアウトする
   */
  public onLogout(): void {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }
}
