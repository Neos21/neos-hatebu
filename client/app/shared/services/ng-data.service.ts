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
    return this.httpClient.get(`${environment.serverUrl}/ng-data`).toPromise()
      .then((ngData: NgData) => {
        // 取得成功・キャッシュする
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
   * NG URL を追加する : キャッシュには直接格納し、API 通信が失敗しても無視する
   * 
   * @param url NG URL
   * @return Promise
   */
  public addNgUrl(url: string): Promise<any> {
    // キャッシュに直接追加する (id, userId, createdAt は未入力)
    const ngUrlObj = new NgUrl();
    ngUrlObj.url = url;
    this.ngUrls.push(ngUrlObj);
    
    return this.httpClient.put(`${environment.serverUrl}/ng-urls`, { ngUrl: url }).toPromise()
      .catch((error) => {
        // エラーは無視する
        console.warn('NG URL 追加 : 失敗', error);
      });
  }
  
  /**
   * NG ワード一覧を取得する : キャッシュがあればキャッシュを返す
   * 
   * @return NG ワード一覧
   */
  public findNgWords(): Promise<NgWord[]> {
    // キャッシュがあればキャッシュを返す
    if(this.ngWords && this.ngWords.length) {
      return Promise.resolve(this.ngWords);
    }
    
    return this.httpClient.get(`${environment.serverUrl}/ng-words`).toPromise()
      .then((ngWords: NgWord[]) => {
        // 取得成功・キャッシュする
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
    return this.httpClient.put(`${environment.serverUrl}/ng-words`, { ngWord: word }).toPromise()
      .then((createdNgWord: NgWord) => {
        // 参照渡しで利用している画面にも反映されるよう push() で操作する
        this.ngWords.push(createdNgWord);
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
    return this.httpClient.delete(`${environment.serverUrl}/ng-words/${ngWordId}`).toPromise()
      .then((result) => {
        // 参照渡しで利用している画面にも反映されるよう splice() で操作する
        const removeIndex = this.ngWords.findIndex((ngWord) => {
          return ngWord.id === ngWordId;
        });
        this.ngWords.splice(removeIndex, 1);
        return result;
      })
      .catch((error) => {
        console.error('NG ワード削除 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * NG ドメイン一覧を取得する : キャッシュがあればキャッシュを返す
   * 
   * @return NG ドメイン一覧
   */
  public findNgDomains(): Promise<NgDomain[]> {
    // キャッシュがあればキャッシュを返す
    if(this.ngDomains && this.ngDomains.length) {
      return Promise.resolve(this.ngDomains);
    }
    
    return this.httpClient.get(`${environment.serverUrl}/ng-domains`).toPromise()
      .then((ngDomains: NgDomain[]) => {
        // 取得成功・キャッシュする
        this.ngDomains = ngDomains;
        return ngDomains;
      })
      .catch((error) => {
        console.error('NG ドメイン一覧取得 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * NG ドメインを追加する
   * 
   * @param domain NG ドメイン
   * @return 追加した NG ドメイン
   */
  public addNgDomain(domain: string): Promise<any> {
    return this.httpClient.put(`${environment.serverUrl}/ng-domains`, { ngDomain: domain }).toPromise()
      .then((createdNgDomain: NgDomain) => {
        // 参照渡しで利用している画面にも反映されるよう push() で操作する
        this.ngDomains.push(createdNgDomain);
        return createdNgDomain;
      })
      .catch((error) => {
        console.error('NG ドメイン追加 : 失敗', error);
        return Promise.reject(error);
      });
  }
  
  /**
   * NG ドメインを削除する
   * 
   * @param ngDomainId 削除対象の NG ドメイン ID
   * @return Promise
   */
  public removeNgDomain(ngDomainId: string|number): Promise<any> {
    return this.httpClient.delete(`${environment.serverUrl}/ng-domains/${ngDomainId}`).toPromise()
      .then((result) => {
        // 参照渡しで利用している画面にも反映されるよう splice() で操作する
        const removeIndex = this.ngDomains.findIndex((ngDomain) => {
          return ngDomain.id === ngDomainId;
        });
        this.ngDomains.splice(removeIndex, 1);
        return result;
      })
      .catch((error) => {
        console.error('NG ドメイン削除 : 失敗', error);
        return Promise.reject(error);
      });
  }
}
