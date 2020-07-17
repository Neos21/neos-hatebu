import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { PageDataService } from './shared/services/page-data.service';
import { Category } from './shared/classes/category';
import { LogoutService } from './shared/services/logout.service';

/**
 * App Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /** ページタイトル */
  public pageTitle: string = `Neo's Hatebu`;
  /** サイドメニュー .menu の表示状況を管理するフラグ */
  public isShownMenu: boolean = false;
  /** カテゴリ一覧 */
  public categories: Category[] = [];
  
  /** 左利きモードか否か (true:左利きモード Default・false:右利きモード) */
  private isLeftHandMode: boolean = true;
  
  /**
   * コンストラクタ
   * 
   * @param router Router
   * @param renderer2 Renderer2
   * @param document Document
   * @param authGuard AuthGuard
   * @param pageDataService PageDataService
   * @param logoutService LogoutService
   */
  constructor(
    private router: Router,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: any,
    private authGuard: AuthGuard,
    private pageDataService: PageDataService,
    private logoutService: LogoutService
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // ページ遷移時はサイドメニューを閉じ、ページトップに遷移させる
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.toggleMenu(false);
        window.scrollTo(0, 0);  // RouterModule.forRoot() に scrollPositionRestoration: 'enabled' を設定してみたが、何か動きがカクつくのでそちらは止めた
      }
    });
    
    // ページタイトルを受け取る
    this.pageDataService.pageTitle.subscribe((pageTitle) => {
      // ExpressionChangedAfterItHasBeenCheckedError を回避するため setTimeout() を使う : https://qiita.com/seteen/items/7dcfa82a96b8530fd131
      setTimeout(() => {
        this.pageTitle = pageTitle;
      }, 0);
    });
    // カテゴリ一覧を受け取る
    this.pageDataService.categories.subscribe((categories) => {
      this.categories = categories;
    });
    // カテゴリ別のエントリ数を受け取る
    this.pageDataService.entryCount.subscribe((entryCount) => {
      const targetCategoryIndex = this.categories.findIndex((category) => {
        return category.id === entryCount.categoryId;
      });
      if(targetCategoryIndex < 0) {
        return;  // 不正値
      }
      this.categories[targetCategoryIndex].entryCount = entryCount.entryCount;
    });
  }
  
  /**
   * ログインしているかどうか
   * 
   * @return ログインしていれば true
   */
  public isLogined(): boolean {
    return this.authGuard.isLogined;
  }
  
  /**
   * サイドメニューを開閉する
   * 
   * @param isShown サイドメニューを強制的に開く場合は true・強制的に閉じる場合は false を指定する
   */
  public toggleMenu(isShown?: boolean): void {
    // 引数が指定されていれば引数に従って操作、そうでなければ現在の状態を反転させる
    this.isShownMenu = typeof isShown !== 'undefined' ? isShown : !this.isShownMenu;
    this.renderer2[this.isShownMenu ? 'addClass' : 'removeClass'](this.document.body, 'show-menu');
  }
  
  /**
   * 利き手モードを切り替える
   */
  public toggleHand(): void {
    this.isLeftHandMode = !this.isLeftHandMode;
    this.renderer2[this.isLeftHandMode ? 'removeClass' : 'addClass'](this.document.body, 'right-hand-mode');
  }
  
  /**
   * ページ最上部に戻る
   */
  public onTop(): void {
    window.scrollTo(0, 0);
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
  
  /**
   * 一つ前のカテゴリページに移動する
   */
  public onPrevCategory(): void {
    const currentCategoryId = this.detectCurrentCategoryId();
    
    // カテゴリ以外のページを開いている場合は最初のカテゴリに移動する
    if(!currentCategoryId) {
      this.router.navigate(['/home'], { queryParams: { categoryId: this.categories[0].id }});
      return;
    }
    
    // 現在のカテゴリの添字を拾う
    const currentCategoryIndex = this.categories.findIndex((category) => {
      return category.id === currentCategoryId;
    });
    
    // 配列の一つ前のカテゴリを拾う
    // (カテゴリ ID を単純にデクリメントするのは、カテゴリ ID が連番である前提の実装になってしまうため)
    const prevCategory = this.categories[currentCategoryIndex - 1];
    
    // 一つ前のカテゴリがなければ、最後のカテゴリに移動する
    if(!prevCategory) {
      this.router.navigate(['/home'], { queryParams: { categoryId: this.categories[this.categories.length - 1].id }});
      return;
    }
    
    // 一つ前のカテゴリに移動する
    this.router.navigate(['/home'], { queryParams: { categoryId: prevCategory.id }});
  }
  
  /**
   * 一つ後のカテゴリページに移動する
   */
  public onNextCategory(): void {
    const currentCategoryId = this.detectCurrentCategoryId();
    
    // カテゴリ以外のページを開いている場合は最初のカテゴリに移動する
    if(!currentCategoryId) {
      this.router.navigate(['/home'], { queryParams: { categoryId: this.categories[0].id }});
      return;
    }
    
    // 現在のカテゴリの添字を拾う
    const currentCategoryIndex = this.categories.findIndex((category) => {
      return category.id === currentCategoryId;
    });
    
    // 配列の一つ後のカテゴリを拾う
    const nextCategory = this.categories[currentCategoryIndex + 1];
    
    // 一つ後のカテゴリがなければ、最初のカテゴリに移動する
    if(!nextCategory) {
      this.router.navigate(['/home'], { queryParams: { categoryId: this.categories[0].id }});
      return;
    }
    
    // 一つ後のカテゴリに移動する
    this.router.navigate(['/home'], { queryParams: { categoryId: nextCategory.id }});
  }
  
  /**
   * 現在開いているページの URL からカテゴリ ID を拾う
   * 
   * @return カテゴリ ID。カテゴリ系のページを開いていない場合は null
   */
  private detectCurrentCategoryId(): number | null {
    const match = this.router.url.match((/\/home\?categoryId=([0-9]*)/u));
    if(!match) {
      return null;
    }
    const currentCategoryId = Number(match[1]);
    return currentCategoryId;
  }
}
