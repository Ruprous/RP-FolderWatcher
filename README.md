# RP Folder Watcher

**バージョン: v1.0.1**

> :us: **English README is available: [README-EN.md](./README-EN.md)**

Premiere Pro 向けの Adobe CEP 拡張機能。  
指定フォルダを監視し、画像・動画・音声・PSD・AI などのファイルを自動でプロジェクトにインポートします。

---

## 🆕 更新履歴

### v1.0.1
- 大容量ファイルの書き込み完了判定を強化し、未完了ファイルの誤インポートを防止
- インポート失敗時は履歴に記録しないよう改善し、再インポートが容易に

---

## 📦 主な機能

- ファイルの安定を検知してから安全に自動インポート  
- メディアの種類（画像 / 動画 / 音声 / グラフィック）ごとにフィルター設定可能  
- UIにチェックボックスでインポート対象を切り替え（設定は localStorage に保存）  
- すでに読み込まれたファイルはスキップされるため、重複なし  
- プロジェクトごとの設定（監視対象フォルダなど）とインポート履歴は JSON で管理・復元

---

## 🔧 技術構成

| ファイル | 内容 |
|---------|------|
| `index.html` | UI パネル |
| `ext.js` | CEPパネル側ロジック（fs.watch、インポート制御など） |
| `Importer.jsx` | ExtendScript による Premiere Pro への実ファイルインポート |
| `manifest.xml` | 拡張機能のメタ情報（ID、対応バージョン等） |
| `style.css` | UIスタイリング |
| `projectFolderMap.json` | プロジェクト別フォルダ監視設定 |
| `importedFilesMap.json` | インポート済みファイルの記録 |

---

## 📂 ディレクトリ構成（簡易）

```
RPFolderWatcher/
├── css/
├── CSXS/
├── jsx/
├── lib/
├── index.html
├── ext.js
├── importedFilesMap.json
├── projectFolderMap.json
├── LICENSE.md
├── LICENSE_us_en.md
└── README.md
```

---

## 🚀 動作環境

- **対応ソフト**：Adobe Premiere Pro（CEP拡張対応バージョン）  
- **確認済みバージョン**：**Premiere Pro 25.1.0（ビルド73 / 2025年版）**  

- **確認済みOS**：Windows 10  
- **Macでの動作は未検証です。**

> 🔧 本拡張機能は Node.js 不要で、Adobe CEP 上で完結します。

---

## 🐛 デバッグモードを有効にする（Windows）

Adobe CEP拡張機能を読み込ませるには、Windowsのレジストリエディタで**デバッグモードの有効化**が必要です。

### 手順

1. **Windowsキー + R** を押して「ファイル名を指定して実行」を開く  
2. `regedit` と入力して「OK」→ レジストリエディタを起動  
3. 以下のキーに移動：

   ```
   HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.12
   ```

4. 右ペインに以下の2つの文字列値（`REG_SZ`）を追加 or 編集：

   | 名前 | 種類 | 値 |
   |------|------|----|
   | `PlayerDebugMode` | `REG_SZ` | `1` |
   | `LogLevel` | `REG_SZ` | `1`（※任意） |

> `CSXS.12` は Adobe CC のバージョンによって異なる場合があります。

---

## 🔧 導入方法（Windows）

1. 以下のパスを開きます：

   ```
   C:\Users\<ユーザー名>\AppData\Roaming\Adobe\CEP\extensions\
   ```

2. 本リポジトリをクローンまたはZIPでダウンロードし、  
   中身をすべて `RP-FolderWatcher` フォルダにまとめて上記にコピーします。

   最終的に以下のような構成になるようにしてください：

   ```
   C:\Users\<ユーザー名>\AppData\Roaming\Adobe\CEP\extensions\RP-FolderWatcher\
       ├── index.html
       ├── ext.js
       ├── CSXS/
       ├── jsx/
       ├── ...（省略）
   ```

3. Premiere Pro を再起動し、「ウィンドウ > 拡張機能」から `RP Folder Watcher` を開きます。

---

## ⚠️ 注意事項

- 本プロジェクトに含まれるすべてのファイルは、著作権者の許可なく**再配布・商用利用を禁止**します。
- 利用・改変は自由ですが、**再配布・販売は禁止**です。
- 詳細なライセンスは [`LICENSE.md`](./LICENSE.md) または [`LICENSE_us_en.md`](./LICENSE_us_en.md) を確認してください。

---

## 📜 License

© 2024 Ruprous  
This software is licensed under custom terms.  
See [`LICENSE.md`](./LICENSE.md) or [`LICENSE_us_en.md`](./LICENSE_us_en.md) for details.
