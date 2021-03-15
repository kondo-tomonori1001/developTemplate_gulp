# Gulpのテンプレートソースファイル
## コマンド
### 開発用コマンド（ローカルサーバー起動）
```
npx gulp
```
### dist配下のクリーンアップ
```
npx gulp clean
```
### buildコマンド
※ソースツリーを生成しない
```
npx gulp build
```

## 主なタスク
- Sassのコンパイル(DartSass)
- autoprefixerでベンダープレフィックスを自動付与
- 画像の圧縮処理(png、jpeg、svg)
- プラグイン等の外部ＪＳの結合
- browserSyncで開発用サーバーの立上げ及びSSI
- その他必要ファイルのdistフォルダへのコピー

