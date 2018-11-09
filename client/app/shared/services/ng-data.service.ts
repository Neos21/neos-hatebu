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
   * NG 情報を取得する
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
}
