/**
 * NG URL 情報
 */
export class NgUrl {
  /** ID */
  public id: string | number;
  /** ユーザ ID */
  public userId: string | number;
  /** 記事タイトル (Entry と同じ) */
  public title: string;
  /** 記事 URL (Entry と同じ) */
  public url: string;
  /** 記事本文抜粋 (Entry と同じ) */
  public description: string;
  /** ブクマ数 (Entry と同じ) */
  public count: string | number;
  /** 日時 (Entry と同じ) */
  public date: string;
  /** Favicon URL (Entry と同じ) */
  public faviconUrl: string;
  /** サムネイル URL (Entry と同じ) */
  public thumbnailUrl: string;
  /** 登録日 */
  public createdAt: string;
}
