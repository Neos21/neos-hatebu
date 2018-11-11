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
    
    const encodedUrl = encodeURI(value.replace(/http(s)?:\/\//, ''));
    return `http://b.hatena.ne.jp/entry/s/${encodedUrl}`;
  }
}
