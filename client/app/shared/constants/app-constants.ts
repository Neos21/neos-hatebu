/**
 * アプリ内で使う定数
 */
export const appConstants = {
  /** LocalStorage 関連 */
  localStorage: {
    /** ログインユーザ情報を格納するキー */
    userInfoKey: 'userInfo'
  },
  /** SessionStorage 関連 */
  sessionStorage: {
    /** ログイン画面に初期表示させたいフィードバックメッセージがあればこのキーに格納する */
    loginInitMessageKey: 'loginInitMessage'
  }
};
