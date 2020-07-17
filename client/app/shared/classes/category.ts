import { Entry } from './entry';

/**
 * カテゴリ情報のクラス
 */
export class Category {
  /** カテゴリ ID */
  public id: string | number;
  /** カテゴリ名 */
  public name: string;
  /** RSS URL */
  public rssUrl: string;
  /** ページ URL */
  public pageUrl: string;
  /** 最終クロール日時 */
  public updatedAt: string;
  
  /** 紐付くエントリ一覧 */
  public entries: Entry[];
  /** フィルタ済のエントリー数 */
  public entryCount: number;
}
