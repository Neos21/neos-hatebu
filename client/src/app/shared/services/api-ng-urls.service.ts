import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiNgUrlsService {
  constructor(private httpClient: HttpClient) { }
  
  public getNgUrls(): Promise<string[]> {
    // TODO : NG URL 一覧
    return Promise.resolve([
      'http://example.com/3',
      'http://example.com/5'
    ]);
  }
  
  public addNgUrl(url: string): Promise<void> {
    // TODO : NG URL 追加
    return Promise.resolve();
  }
}
