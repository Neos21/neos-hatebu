import { NgUrl } from './ng-url';
import { NgWord } from './ng-word';
import { NgDomain } from './ng-domain';

/**
 * NG 情報
 */
export class NgData {
  /** NG URL */
  public ngUrls: NgUrl[];
  /** NG ワード */
  public ngWords: NgWord[];
  /** NG ドメイン */
  public ngDomains: NgDomain[];
}
