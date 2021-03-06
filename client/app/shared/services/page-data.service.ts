import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { Category } from '../classes/category';
import { EntryCount } from '../classes/entry-count';

/**
 * 画面間でのデータ受け渡しを行うサービス
 * 
 * データを追加する側は Subject#next() に価を渡す
 * データを取得する側は Observable#subscribe() で取得する
 */
@Injectable({
  providedIn: 'root'
})
export class PageDataService {
  /** ページタイトルの Subject */
  public pageTitleSubject: Subject<string> = new Subject<string>();
  /** ページタイトル */
  public pageTitle: Observable<string> = this.pageTitleSubject.asObservable();
  
  /** カテゴリメニューの Subject */
  public categoriesSubject: Subject<Category[]> = new Subject<Category[]>();
  /** カテゴリメニュー */
  public categories: Observable<Category[]> = this.categoriesSubject.asObservable();
  
  /** カテゴリ別エントリ数の Subject */
  public entryCountSubject: Subject<EntryCount> = new Subject<EntryCount>();
  /** カテゴリ別エントリ数 */
  public entryCount: Observable<EntryCount> = this.entryCountSubject.asObservable();
}
