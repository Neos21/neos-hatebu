/**
 * エントリ情報のクラス
 */
export class Entry {
  /** ID */
  public id: string | number;
  /** 紐付くカテゴリ ID */
  public categoryId: string | number;
  /** 記事タイトル */
  public title: string;
  /** 記事 URL */
  public url: string;
  /** 記事本文抜粋 */
  public description: string;
  /** ブクマ数 */
  public count: string | number;
  /** 日時 */
  public date: string;
  /** Favicon URL */
  public faviconUrl: string;
  /** サムネイル URL */
  public thumbnailUrl: string;
  /** 最終クロール日時 */
  public updatedAt: string;
}
