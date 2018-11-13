import { Pipe, PipeTransform } from '@angular/core';

/**
 * はてブの URL に変換する
 */
@Pipe({
  name: 'hatebuUrl'
})
export class HatebuUrlPipe implements PipeTransform {
  /**
   * 変換処理
   * 
   * @param value URL
   * @param _args オプション
   * @return はてブの URL
   */
  public transform(value: string, _args?: any): string {
    if(!value) {
      return '';
    }
    
    if(value.startsWith('https')) {
      // HTTPS の場合は 'entry/s/' を付与する
      const encodedUrl = encodeURI(value.replace(/https:\/\//, ''));
      return `http://b.hatena.ne.jp/entry/s/${encodedUrl}`;
    }
    else {
      const encodedUrl = encodeURI(value.replace(/http:\/\//, ''));
      return `http://b.hatena.ne.jp/entry/${encodedUrl}`;
    }
  }
}
