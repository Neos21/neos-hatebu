/** カテゴリ別のエントリ数を保持する */
export class EntryCount {
  /** 紐付くカテゴリ ID */
  public categoryId: string | number;
  
  /** エントリ数 */
  public entryCount: number;
  
  /**
   * コンストラクタ
   * 
   * @param categoryId 紐付くカテゴリ ID
   * @param entryCount エントリ数
   */
  constructor(categoryId: string | number, entryCount: number) {
    this.categoryId = categoryId;
    this.entryCount = entryCount;
  }
}
