import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgUrl } from '../classes/ng-url';
import { NgWord } from '../classes/ng-word';
import { NgDomain } from '../classes/ng-domain';
import { environment } from 'client/environments/environment.prod';
import { NgData } from '../classes/ng-data';

/**
 * NG 情報を扱うサービス
 * 一度取得したらキャッシュに溜め、そちらを参照する
 */
@Injectable({
  providedIn: 'root'
})
export class NgDataService {
  /** NG URL のキャッシュ */
  public ngUrls: NgUrl[] = [];
  /** NG ワードのキャッシュ */
  public ngWords: NgWord[] = [];
  /** NG ドメインのキャッシュ */
  public ngDomains: NgDomain[] = [];
  
  /**
   * コンストラクタ
   * 
   * @param httpClient HttpClient
   */
  constructor(private httpClient: HttpClient) { }
  
  /**
   * NG 情報を取得する : 常に DB の情報を取得する
   * 
   * @return NG URL・NG ワード・NG ドメインの一覧
   */
  public findAll(): Promise<NgData> {
    console.log('NG 情報取得 : 開始');
    return this.httpClient.get(`${environment.serverUrl}/ng-data`).toPromise()
      .then((ngData: NgData) => {
        console.log('NG 情報取得 : 成功・キャッシュする', ngData);
        this.ngUrls    = ngData.ngUrls;
        this.ngWords   = ngData.ngWords;
        this.ngDomains = ngData.ngDomains;
        
        return ngData;
      })
      .catch((error) => {
        console.error('NG 情報取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * NG URL を追加する
   * キャッシュには直接格納し、API 通信が失敗しても無視する
   * 
   * @param url NG URL
   * @return Promise
   */
  public addNgUrl(url: string): Promise<any> {
    console.log('NG URL 追加 : 開始');
    
    // キャッシュに直接追加する (id, userId, createdAt は未入力)
    const ngUrlObj = new NgUrl();
    ngUrlObj.url = url;
    this.ngUrls.push(ngUrlObj);
    
    return this.httpClient.put(`${environment.serverUrl}/ng-urls`, { ngUrl: url }).toPromise()
      .then((result) => {
        console.log('NG URL 追加 : 成功', result);
      })
      .catch((error) => {
        // エラーは無視する
        console.error('NG URL 追加 : 失敗', error);
      });
  }
  
  /**
   * NG ワード一覧を取得する : キャッシュがあればキャッシュを返す
   * 
   * @return NG ワード一覧
   */
  public findNgWords(): Promise<NgWord[]> {
    if(this.ngWords && this.ngWords.length) {
      console.log('NG ワード一覧取得 : キャッシュを返却');
      return Promise.resolve(this.ngWords);
    }
    
    console.log('NG ワード一覧取得 : 開始');
    return this.httpClient.get(`${environment.serverUrl}/ng-words`).toPromise()
      .then((ngWords: NgWord[]) => {
        console.log('NG ワード一覧取得 : 成功・キャッシュする');
        this.ngWords = ngWords;
        return ngWords;
      })
      .catch((error) => {
        console.error('NG ワード一覧取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * NG ワードを追加する
   * 
   * @param word NG ワード
   * @return 追加した NG ワード
   */
  public addNgWord(word: string): Promise<any> {
    console.log('NG ワード追加 : 開始');
    return this.httpClient.put(`${environment.serverUrl}/ng-words`, { ngWord: word }).toPromise()
      .then((createdNgWord) => {
        console.log('NG ワード追加 : 成功', createdNgWord);
        return createdNgWord;
      })
      .catch((error) => {
        console.error('NG ワード追加 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * NG ワードを削除する
   * 
   * @param ngWordId 削除対象の NG ワード ID
   * @return Promise
   */
  public removeNgWord(ngWordId: string|number): Promise<any> {
    console.log('NG ワード削除 : 開始');
    return this.httpClient.delete(`${environment.serverUrl}/ng-words/${ngWordId}`).toPromise()
      .then((result) => {
        console.log('NG ワード削除 : 成功', result);
      })
      .catch((error) => {
        console.error('NG ワード削除 : 失敗', error);
        return Promise.reject(error);
      });
  }
}
