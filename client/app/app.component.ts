import { Component, Inject, OnInit, Renderer2, HostListener } from '@angular/core';
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
  
  /** 最後に touchend イベントが発生した時の時間 (ダブルタップによるズーム禁止処理用) */
  private lastTouchEnd: number = 0;
  
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
      if (event instanceof NavigationEnd) {
        this.toggleMenu(false);
        window.scrollTo(0, 0);  // RouterModule.forRoot() に scrollPositionRestoration: 'enabled' を設定してみたが、何か動きがカクつくのでそちらは止めた
      }
    });
    
    // ページタイトルを受け取る
    this.pageDataService.pageTitle.subscribe((pageTitle) => {
      this.pageTitle = pageTitle;
    });
    // カテゴリ一覧を受け取る
    this.pageDataService.categories.subscribe((categories) => {
      this.categories = categories;
    });
  }
  
  /**
   * ダブルタップによるズームを禁止する
   * 定数 delay で決めた間隔でのタップを無効化する
   * 
   * @param event TouchEvent
   */
  @HostListener('document:touchend', ['$event'])
  public onTouchEnd(event: TouchEvent): void {
    const delay = 450;  // ms
    const now = new Date().getTime();
    if((now - this.lastTouchEnd) < delay) {
      event.preventDefault();
    }
    this.lastTouchEnd = now;
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
}
