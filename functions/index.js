const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.nyancrypto = functions.https.onRequest((request, response) => {
  console.log(request.body.text);
  const kuromoji = require('kuromoji');
  const originText = '今日も上司の山田にボコられた';
  let nyancryptoText = request.query.text;
  /**
   * 形態素解析する
   * @param {string} text 解析したいテキスト
   * @returns {Promise<Array|Object>}
   */
  function analyze(text) {
    // 形態素解析のオブジェクト
    const builder = kuromoji.builder({
      // 辞書を設定
      dicPath: 'node_modules/kuromoji/dict',
    });
    // Promiseオブジェクトを返却する.処理成功時にはresolveが呼ばれる
    return new Promise((resolve, reject) => {
      builder.build((err, tokenizer) => {
        if (err) {
          reject(err);
          return;
        }
        const tokens = tokenizer.tokenize(text);
        resolve(tokens);
      });
    });
  }

  // 形態素解析
  analyze(nyancryptoText)
    // 解析結果の配列から名詞だけを抜く
    .then((tokens) => {
      // 属性が名詞かつ一般活用のものを抽出
      const nounFilteredList = tokens.filter((tokensText) => (tokensText.pos === '名詞') && (tokensText.pos_detail_1 === '一般'));
      return nounFilteredList;
    })
    // 抜いた名詞からテキストのみを抜く
    .then((nounList) => {
      const nounTextList = nounList.map((nounElm) => nounElm.surface_form);
      return nounTextList;
    })
    // オリジナルテキストの名詞部分を書き換える
    .then((nounTextList) => {
      nounTextList.forEach((nounText) => {
        nyancryptoText = nyancryptoText.replace(nounText, 'にゃーん');
      });
      response.send(nyancryptoText);
      return
    })
    .catch((error) => {
      console.log(error);
    });
});
