import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import * as moment from 'moment-timezone';

import { CategoriesService } from '../../../shared/services/categories.service';
import { NgDataService } from '../../../shared/services/ng-data.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { Category } from '../../../shared/classes/category';
import { NgUrl } from '../../../shared/classes/ng-url';
import { EntryCount } from '../../../shared/classes/entry-count';
import { Entry } from '../../../shared/classes/entry';

/**
 * Home Component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** 表示中のカテゴリのデータ */
  public currentCategory: Category = null;
  /** 読込中のフィードバックメッセージ */
  public isLoading: boolean = true;
  /** エラー時のフィードバックメッセージ */
  public errorMessage: string = '';
  
  /**
   * コンストラクタ
   * 
   * @param router Router
   * @param activatedRoute ActivatedRoute
   * @param pageDataService PageDataService
   * @param categoriesService CategoriesService
   * @param ngDataService NgDataService
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pageDataService: PageDataService,
    private categoriesService: CategoriesService,
    private ngDataService: NgDataService
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      const categoryId = params.get('categoryId');
      
      // クエリパラメータがない場合は最初のカテゴリにリダイレクトする
      if(categoryId === null || categoryId === undefined) {
        this.moveFirstCategory();
        return;
      }
      
      this.onShowCategory(categoryId);
    });
  }
  
  /**
   * 選択した記事を NG URL に追加して削除する
   * 
   * @param entry 削除する記事
   */
  public onRemoveEntry(entry: Entry): void {
    // 見た目のレスポンスを良くするため、キャッシュにはこの場でデータを作って追加する (id, userId は未入力)
    const ngUrl = new NgUrl();
    ngUrl.title        = entry.title;
    ngUrl.url          = entry.url;
    ngUrl.description  = entry.description;
    ngUrl.count        = entry.count;
    ngUrl.date         = entry.date;
    ngUrl.faviconUrl   = entry.faviconUrl;
    ngUrl.thumbnailUrl = entry.thumbnailUrl;
    ngUrl.createdAt    = moment.utc().toISOString();
    this.ngDataService.ngUrls.push(ngUrl);
    
    // この場で削除する記事を省いておく (onShowCategory() で処理すると重たいため)
    this.currentCategory.entries = this.currentCategory.entries.filter((currentEntry) => {
      return currentEntry.url !== entry.url;
    });
    // フィルタしたエントリ数を渡す
    this.pageDataService.entryCountSubject.next(new EntryCount(this.currentCategory.id, this.currentCategory.entries.length));
    
    // 記事を削除するための API を叩く
    this.ngDataService.addNgUrl(ngUrl);
    
    // ボタンからフォーカスを外す
    try {
      (window.document.activeElement as any).blur();
    }
    catch(error) {
      console.warn('activeElement.blur() に失敗');
    }
  }
  
  /**
   * 指定のカテゴリ ID を再スクレイピングして表示する
   * 
   * @param categoryId カテゴリ ID
   */
  public onReloadEntries(categoryId: string | number): void {
    this.currentCategory = null;
    this.isLoading = true;
    this.errorMessage = '';
    
    this.categoriesService.reloadById(categoryId)
      .then(() => {
        // 再スクレイピング成功・再表示することでフィルタ表示する
        return this.onShowCategory(categoryId);
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorMessage = `再スクレイピング失敗 : ${JSON.stringify(error)}`;
      });
  }
  
  /**
   * 一つ前のカテゴリページに移動する
   */
  public onPrevCategory(): void {
    this.categoriesService.findAll()
      .then((categories) => {
        // 現在のカテゴリの添字を拾う
        const currentCategoryIndex = categories.findIndex((category) => {
          return category.id === this.currentCategory.id;
        });
        
        // 配列の一つ前のカテゴリを拾う
        const prevCategory = categories[currentCategoryIndex - 1];
        
        // 一つ前のカテゴリがなければ、最後のカテゴリに移動する
        if(!prevCategory) {
          return this.router.navigate(['/home'], { queryParams: { categoryId: categories[categories.length - 1].id }});
        }
        
        // 一つ前のカテゴリに移動する
        return this.router.navigate(['/home'], { queryParams: { categoryId: prevCategory.id }});
      });
  }
  
  /**
   * 一つ後のカテゴリページに移動する
   */
  public onNextCategory(): void {
    this.categoriesService.findAll()
      .then((categories) => {
        // 現在のカテゴリの添字を拾う
        const currentCategoryIndex = categories.findIndex((category) => {
          return category.id === this.currentCategory.id;
        });
        
        // 配列の一つ後のカテゴリを拾う
        const nextCategory = categories[currentCategoryIndex + 1];
        
        // 一つ前のカテゴリがなければ、最初のカテゴリに移動する
        if(!nextCategory) {
          return this.router.navigate(['/home'], { queryParams: { categoryId: categories[0].id }});
        }
        
        // 一つ後のカテゴリに移動する
        return this.router.navigate(['/home'], { queryParams: { categoryId: nextCategory.id }});
      });
  }
  
  /**
   * カテゴリ一覧のうち最初のカテゴリページに移動する
   */
  private moveFirstCategory(): void {
    this.categoriesService.findAll()
      .then((categories) => {
        const firstCategory = categories[0];
        return this.router.navigate(['/home'], {
          queryParams: {
            categoryId: firstCategory.id
          }
        });
      });
  }
  
  /**
   * カテゴリ別の記事一覧を取得する
   * 
   * @param categoryId カテゴリ ID
   */
  private onShowCategory(categoryId: string | number): Promise<any> {
    this.currentCategory = null;
    this.isLoading = true;
    this.errorMessage = '';
    
    return this.categoriesService.findAll()
      .then((categories) => {
        const currentCategory = categories.find((category) => {
          return `${category.id}` === `${categoryId}`;
        });
        
        // 先にページタイトルを渡す (CategoryService#findAll() はキャッシュされているはずなので)
        this.pageDataService.pageTitleSubject.next(currentCategory.name);
        
        return this.categoriesService.findById(categoryId);
      })
      .then((category) => {
        // NG 情報を参照して除外していく
        const filteredEntries = category.entries
          .filter((entry) => {
            // 記事 URL が NG URL に合致する記事を省く
            return !this.ngDataService.ngUrls.some((ngUrl) => {
              return entry.url === ngUrl.url;
            });
          })
          .filter((entry) => {
            // NG ワードをタイトルか本文に含む記事を省く
            return !this.ngDataService.ngWords.some((ngWord) => {
              return entry.title.includes(ngWord.word) || entry.description.includes(ngWord.word);
            });
          })
          .filter((entry) => {
            // NG ドメインを URL に含む記事を省く
            return !this.ngDataService.ngDomains.some((ngDomain) => {
              return entry.url.includes(ngDomain.domain);
            });
          });
        
        // 画面に設定する : 複製しないと参照が残っており、フィルタしたエントリ一覧をキャッシュしてしまう
        const currentCategory = Object.assign({}, category);
        // 最終クロール日時を JST にする
        currentCategory.updatedAt = moment(currentCategory.updatedAt).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
        // エントリの日付のフォーマットを修正して設定する
        currentCategory.entries = filteredEntries.map((entry) => {
          entry.date = moment(entry.date, 'YYYY/MM/DD HH:mm').format('YYYY-MM-DD HH:mm');
          return entry;
        });
        
        // 読込中の表示を消す
        this.isLoading = false;
        // 画面に設定する
        this.currentCategory = currentCategory;
        // フィルタしたエントリ数を渡す
        this.pageDataService.entryCountSubject.next(new EntryCount(this.currentCategory.id, this.currentCategory.entries.length));
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorMessage = `指定のカテゴリのエントリ取得 : 失敗 : ${JSON.stringify(error)}`;
      });
  }
}
