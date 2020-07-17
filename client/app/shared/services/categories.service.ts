import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Category } from '../classes/category';

/**
 * カテゴリ情報とそのカテゴリに紐付くエントリを扱うサービス
 * 一度取得したデータは本クラス内にキャッシュする
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  /** カテゴリ一覧のキャッシュ */
  public categories: Category[] = [];
  
  /**
   * コンストラクタ
   * 
   * @param httpClient HttpClient
   */
  constructor(private httpClient: HttpClient) { }
  
  /**
   * カテゴリ一覧を取得する
   * 
   * @return カテゴリ一覧
   */
  public findAll(): Promise<Category[]> {
    // キャッシュがあればキャッシュを返す
    if(this.categories.length) {
      return Promise.resolve(this.categories);
    }
    
    return this.httpClient.get(`${environment.serverUrl}/categories`).toPromise()
      .then((categories: Category[]) => {
        // 取得成功・キャッシュする
        this.categories = categories;
        return categories;
      })
      .catch((error) => {
        console.error('カテゴリ一覧取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * カテゴリごとのエントリ一覧を取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報とエントリ一覧
   */
  public findById(id: string | number): Promise<Category> {
    let targetCategory;
    return this.findAll()
      .then((categories) => {
        targetCategory = categories.find((category) => {
          return `${category.id}` === `${id}`;
        });
        
        // キャッシュがあればキャッシュを返す
        if(targetCategory && targetCategory.entries && targetCategory.entries.length) {
          return Promise.resolve(targetCategory);
        }
        
        return this.httpClient.get(`${environment.serverUrl}/categories/${id}`).toPromise()
          .then((category: Category) => {
            // 取得成功・キャッシュする
            targetCategory.entries = category.entries;
            return category;
          });
      })
      .catch((error) => {
        console.error('カテゴリごとのエントリ取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * 指定のカテゴリ ID のエントリ一覧を再スクレイピングして取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報と再スクレイピングしたエントリ一覧
   */
  public reloadById(id: string | number): Promise<any> {
    // 再スクレイピング対象のカテゴリ
    const targetCategory = this.categories.find((category) => {
      return category.id === id;
    });
    
    return this.httpClient.get(`${environment.serverUrl}/categories/${id}/reload`).toPromise()
      .then((category: Category) => {
        // 取得成功・キャッシュする
        targetCategory.updatedAt = category.updatedAt;  // 最終クロール日時も更新する
        targetCategory.entries = category.entries;
        return category;
      })
      .catch((error) => {
        console.error('再スクレイピング : 失敗', error);
        return Promise.reject(error);
      });
  }
}
