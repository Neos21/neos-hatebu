import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment.prod';
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
    if(this.categories.length) {
      console.log('カテゴリ一覧取得 : キャッシュを返却');
      return Promise.resolve(this.categories);
    }
    
    console.log('カテゴリ一覧取得 : 開始');
    return this.httpClient.get(`${environment.serverUrl}/categories`).toPromise()
      .then((categories: Category[]) => {
        console.log('カテゴリ一覧取得 : 成功・キャッシュする', categories);
        this.categories = categories;
        return categories;
      })
      .catch((error) => {
        console.log('カテゴリ一覧取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * カテゴリごとのエントリ一覧を取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報とエントリ一覧
   */
  public findById(id: string|number): Promise<Category> {
    const targetCategory = this.categories.find((category) => {
      return category.id === id;
    });
    if(targetCategory && targetCategory.entries && targetCategory.entries.length) {
      console.log('カテゴリごとのエントリ取得 : キャッシュを返却');
      return Promise.resolve(targetCategory);
    }
    
    console.log('カテゴリごとのエントリ取得 : 開始');
    return this.httpClient.get(`${environment.serverUrl}/categories/${id}`).toPromise()
      .then((category: Category) => {
        console.log('カテゴリごとのエントリ取得 : 成功・キャッシュする', category);
        targetCategory.entries = category.entries;
        return category;
      })
      .catch((error) => {
        console.log('カテゴリごとのエントリ取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
}
