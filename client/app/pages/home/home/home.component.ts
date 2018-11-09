import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LogoutService } from '../../../shared/services/logout.service';
import { CategoriesService } from '../../../shared/services/categories.service';
import { Category } from '../../../shared/classes/category';

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
    private logoutService: LogoutService
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
        
        // TODO : NG 情報を取得する
        
        // 「総合 - 人気」の記事を取得する
        return this.onShowCategory(1);
      });
  }
  
  /**
   * カテゴリ別の記事一覧を取得する
   * 
   * @param categoryId カテゴリ ID
   */
  public onShowCategory(categoryId: string|number): void {
    this.categoriesService.findById(categoryId)
      .then((category) => {
        this.currentCategory = category;
        
        // TODO : currentCategory.entries をフィルタする
      })
      .catch((error) => {
        // 指定のカテゴリのエントリ取得に失敗
        console.error(error);
      });
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
