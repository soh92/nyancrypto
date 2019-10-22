// ツイートを社会性フィルターで暗号化する

const kuromoji = require('kuromoji');

const originText = '今日も上司の山田さんにボコられた';
let nyancryptoText = originText;

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
module.exports.nyancrypto = analyze(nyancryptoText)
  // 解析結果の配列から名詞だけを抜く
  .then((tokens) => {
    // 属性が名詞かつ一般活用のものを抽出
    const nounFilteredList = tokens.filter((tokensText) => (tokensText.pos_detail_1 === '一般') || (tokensText.pos_detail_1 === '固有名詞'));
    console.log(nounFilteredList);
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
    console.log(nyancryptoText);
    return nyancryptoText
  })
  .catch((error) => {
    console.log(error);
  });
