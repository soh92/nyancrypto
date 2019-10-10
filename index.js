const kuromoji = require('kuromoji');

const originText = '今日も上司の山田にボコられた';

// 形態素解析のオブジェクト
const builder = kuromoji.builder({
  // 辞書を設定
  dicPath: 'node_modules/kuromoji/dict',
});

/**
 * 形態素解析する
 * @param {string} text 解析したいテキスト
 * @returns {Promise<Array|Object>}
 */
function analyze(text) {
  // Promiseオブジェクトを返却する.処理成功時にはresolveが呼ばれる
  return new Promise((reject, resolve) => {
    builder.build((err, tokenizer) => {
      if (err) {
        reject(err);
      }
      const tokens = tokenizer.tokenize(text);
      resolve(tokens);
    });
  });
}

analyze(originText).then((tokens) => {
  // 非同期処理成功
  console.log(tokens);
}).catch((error) => {
  // 非同期処理失敗。呼ばれない
  console.log(error);
});

// 名詞を「にゃーん」へ変換する
