import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'client/environments/environment.prod';

const dummyCategories = [
  { id:  1, name: '総合 - 人気'          , path:  'hotentry/all'           },
  { id:  2, name: '総合 - 新着'          , path: 'entrylist/all'           },
  { id:  3, name: '一般 - 人気'          , path:  'hotentry/general'       },
  { id:  4, name: '一般 - 新着'          , path: 'entrylist/general'       },
  { id:  5, name: '世の中 - 人気'        , path:  'hotentry/social'        },
  { id:  6, name: '世の中 - 新着'        , path: 'entrylist/social'        },
  { id:  7, name: '政治と経済 - 人気'    , path:  'hotentry/economics'     },
  { id:  8, name: '政治と経済 - 新着'    , path: 'entrylist/economics'     },
  { id:  9, name: '暮らし - 人気'        , path:  'hotentry/life'          },
  { id: 10, name: '暮らし - 新着'        , path: 'entrylist/life'          },
  { id: 11, name: '学び - 人気'          , path:  'hotentry/knowledge'     },
  { id: 12, name: '学び - 新着'          , path: 'entrylist/knowledge'     },
  { id: 13, name: 'テクノロジー - 人気'  , path:  'hotentry/it'            },
  { id: 14, name: 'テクノロジー - 新着'  , path: 'entrylist/it'            },
  { id: 15, name: 'おもしろ - 人気'      , path:  'hotentry/fun'           },
  { id: 16, name: 'おもしろ - 新着'      , path: 'entrylist/fun'           },
  { id: 17, name: 'エンタメ - 人気'      , path:  'hotentry/entertainment' },
  { id: 18, name: 'エンタメ - 新着'      , path: 'entrylist/entertainment' },
  { id: 19, name: 'アニメとゲーム - 人気', path:  'hotentry/game'          },
  { id: 20, name: 'アニメとゲーム - 新着', path: 'entrylist/game'          }
];

@Injectable({
  providedIn: 'root'
})
export class ApiEntriesService {
  constructor(private httpClient: HttpClient) { }
  
  public getCategories(): Promise<any[]> {
    // TODO : API
    // TODO : 一度取得したらクラス内にキャッシュしておきたい。12時間もページ開きっぱなしにはならないだろうし。w LocalStorage に入れるのは容量上限に引っかかる (上限突破した時にどうハンドリングするか悩む) から止めておく。
    return Promise.resolve(dummyCategories);
  }
  
  public getEntries(id: number): Promise<any> {
    return Promise.resolve({
      id: id,
      name: dummyCategories.find((category) => {
        return category.id === id;
      }).name,
      path: dummyCategories.find((category) => {
        return category.id === id;
      }).path,
      updatedAt: '2018-11-06 18:00',
      entries: [
        // tslint:disable:max-line-length
        { users: 10, date: '2018-11-01 12:31', title: 'ほげ1', url: 'http://example.com/1', description: '説明1', favicon: 'http://example.com/1/favicon.png', thumb: 'http://example.com/1/thumb.png' },
        { users: 15, date: '2018-11-01 12:32', title: 'ほげ2', url: 'http://example.com/2', description: '説明2', favicon: 'http://example.com/2/favicon.png', thumb: 'http://example.com/2/thumb.png' },
        { users: 21, date: '2018-11-01 12:33', title: 'ほげ3', url: 'http://example.com/3', description: '説明3', favicon: 'http://example.com/3/favicon.png', thumb: 'http://example.com/3/thumb.png' },
        { users: 30, date: '2018-11-01 12:34', title: 'ほげ4', url: 'http://example.com/4', description: '説明4', favicon: 'http://example.com/4/favicon.png', thumb: 'http://example.com/4/thumb.png' },
        { users: 96, date: '2018-11-01 12:35', title: 'ほげ5', url: 'http://example.com/5', description: '説明5', favicon: 'http://example.com/5/favicon.png', thumb: 'http://example.com/5/thumb.png' }
      ]
    });
  }
  
  public test(): Promise<any> {
    // withCredentials: true が効き目なし・必要なところで毎度ログイン情報を渡すしかないのか？これって
    return this.httpClient.get(`${environment.apiUrl}/member-only`, { params: { userId: 'Neos21', password: 'asdf'} }).toPromise()
      .then((result) => {
        console.log('認証できてる様子', result);
      })
      .catch((error) => {
        console.error('ダメっぽい', error);
      });
  }
}
