# 塩釜口駅時刻表アプリケーション - アーキテクチャドキュメント

## 📌 アプリケーション概要

このアプリケーションは、名古屋市営地下鉄鶴舞線の塩釜口駅を利用する学生や通勤者向けに開発された、時刻表表示 Web アプリケーションです。

### 🎯 主な機能

- **時刻表表示**: 現在時刻から次の電車をリアルタイムで表示
- **一覧表示**: 全ての電車時刻を上り・下りで一覧表示
- **最短電車検索**: 授業終了時間から最も近い電車を検索
- **終電情報**: 終電の時刻と経過状況を表示
- **路線図**: 名古屋市営地下鉄の路線図を表示

---

## 🏗️ アーキテクチャ構成

### 技術スタック

- **フレームワーク**: Next.js 15.3.4 (App Router)
- **React**: 19.0.0
- **状態管理**: Jotai 2.12.5
- **スタイリング**: Tailwind CSS 4.0.0
- **データベース**: PostgreSQL 16 + Prisma ORM
- **アイコン**: React Icons
- **日時処理**: holiday-jp（日本の祝日判定）

### フォルダ構成

```
src/
├── app/                    # Next.js App Router ページ
│   ├── page.tsx           # ホームページ（次の電車表示）
│   ├── layout.tsx         # 共通レイアウト
│   ├── list/              # 電車一覧表示
│   ├── last-train/        # 終電情報
│   ├── saitan-train/      # 最短電車検索
│   ├── route-map/         # 路線図
│   └── api/               # API エンドポイント
├── components/            # React コンポーネント
├── atoms/                 # Jotai 状態管理
├── hooks/                 # カスタムフック
├── utils/                 # ユーティリティ関数
└── types/                 # TypeScript 型定義
```

---

## 🧩 コンポーネント詳細説明

### 📍 ナビゲーション・レイアウト系

#### `Navigation.tsx`

**役割**: アプリケーション全体の共通ナビゲーション

- 5 つの主要ページへのリンク
- アクティブページの視覚的な表示
- レスポンシブ対応（デスクトップ・モバイル）

**使用場所**: 全ページ共通（`layout.tsx`で使用）

#### `TabNavigation.tsx`

**役割**: 上り・下り電車の切り替えタブ

- Jotai atom で状態管理
- 一覧表示ページで使用
- 方向アイコン付きタブ表示
- アクティブなタブの視覚的な強調表示

**props**: なし（状態管理から取得）

**使用している状態管理**:

- `activeTabAtom`: アクティブなタブの状態管理（Direction enum 使用）

**UI の表示内容**:

- 上り・下りボタン（それぞれ矢印アイコン付き）
- アクティブなタブは色付きで表示（上り：青、下り：緑）
- ホバー効果とスケール変換

---

### 🚆 電車情報表示系

#### `NextTrainsClient.tsx`

**役割**: ホームページのメインコンポーネント

- 現在時刻の表示
- 上り・下り方向の次の電車表示
- リアルタイム更新

**使用コンポーネント**:

- `TrainDisplayGrid` - 電車情報をグリッド表示

**状態管理**:

- `currentTimeAtom` - 現在時刻
- `filteredUpTrainsAtom` - 上り電車（次の 3 本）
- `filteredDownTrainsAtom` - 下り電車（次の 3 本）

#### `TrainDisplayGrid.tsx`

**役割**: 電車情報を見やすいグリッド形式で表示

- 2×2 のグリッドレイアウト
- 次発電車を大きく表示
- その後の 2 本を小さく表示

**props**:

```typescript
{
  trains: DepartureType[];     // 表示する電車リスト
  title: string;               // "上り"/"下り"
  borderColor: string;         // 境界線の色
}
```

**使用コンポーネント**:

- `Countdown` - 次発電車のカウントダウン

#### `TrainList.tsx` & `TrainListItem.tsx`

**役割**: 電車一覧をリスト形式で表示

- 全ての電車を時系列順に表示
- 次の電車への自動スクロール
- 電車の状態（過去・次発・始発・終電）の視覚的表示

**TrainList props**:

```typescript
{
  trains: DepartureType[];     // 表示する電車リスト
  direction: Direction;        // 方向（Direction enum）
}
```

**TrainListItem props**:

```typescript
{
  train: DepartureType; // 電車情報
  direction: Direction; // 方向（Direction enum）
  timeStatus: TimeStatus; // 時間状態（TimeStatus enum）
  trainEndpoint: TrainEndpoint; // 電車の始発・終電状態（TrainEndpoint enum）
}
```

**使用している状態管理**:

- `currentTimeAtom`: 現在時刻の取得

**機能の詳細**:

- 現在時刻との比較による時間状態の判定
- 始発・終電の判定と表示
- 次の電車への自動スクロール機能
- 状態に応じた背景色とバッジ表示

---

### 🕰️ 特別機能系

#### `LastTrainViewer.tsx`

**役割**: 終電情報の表示

- 上り・下り別の終電情報
- 行き先別の終電情報
- 終電終了時の視覚的警告

**機能**:

- 現在時刻と終電時刻の比較
- 終電が過ぎた場合の赤色表示
- 行き先ごとの詳細情報

#### `SaitanTrainViewer.tsx`

**役割**: 最短電車検索機能

- 授業終了時間の選択（6 つの固定時間）
- 選択時間後の最短電車表示
- 待ち時間の計算と表示

**特徴**:

- 学生向けの実用的機能
- 上り・下り別の候補表示
- 最大 3 つの候補電車

#### `Countdown.tsx`

**役割**: 発車時刻までのカウントダウン表示

- リアルタイム更新（1 秒間隔）
- 分・秒単位の表示

**props**:

```typescript
{
  departureTime: string; // "HH:MM"形式
}
```

---

### 🎨 UI・UX 系

#### `EmptyState.tsx`

**役割**: データが無い場合の表示

- 電車がない時間帯の表示
- 終電終了時の表示

#### `LoadingFallback.tsx`

**役割**: データ読み込み中の表示

- スケルトンローディング
- ユーザー体験の向上

---

## 🔄 状態管理（Jotai Atoms）

### `timeAtom.ts`

```typescript
currentTimeAtom: Atom<Date>;
```

- 現在時刻を管理
- 1 秒間隔で自動更新

### `trainAtom.ts`

```typescript
upTrainsAtom: Atom<DepartureType[]>; // 上り電車全データ
downTrainsAtom: Atom<DepartureType[]>; // 下り電車全データ
filteredUpTrainsAtom: Atom<DepartureType[]>; // 上り電車（次の3本）
filteredDownTrainsAtom: Atom<DepartureType[]>; // 下り電車（次の3本）
```

### `tabAtom.ts`

```typescript
activeTabAtom: Atom<Direction>;
```

- 一覧表示でのタブ状態管理
- Direction enum を使用（Direction.Up / Direction.Down）

---

## 📱 ページ構成

### 1. **ホームページ** (`/`)

- **コンポーネント**: `NextTrainsClient`
- **機能**: 現在時刻からの次の電車表示
- **特徴**: リアルタイム更新、グリッド表示

### 2. **一覧表示** (`/list`)

- **コンポーネント**: `TrainListView`
- **機能**: 全電車の時刻表示
- **特徴**: 上り・下りタブ切り替え、自動スクロール、「一番上に戻る」ボタン

**TrainListView の構成**:

- `TabNavigation`: 上り・下り切り替えタブ
- `TrainList`: 電車一覧表示
- スクロール検知による「一番上に戻る」ボタンの表示・非表示

### 3. **最短電車検索** (`/saitan-train`)

- **コンポーネント**: `SaitanTrainViewer`
- **機能**: 授業終了時間からの最短電車表示
- **特徴**: 6 つの時間選択、待ち時間計算

### 4. **終電情報** (`/last-train`)

- **コンポーネント**: `LastTrainViewer`
- **機能**: 終電時刻と状況表示
- **特徴**: 行き先別情報、終電終了警告

### 5. **路線図** (`/route-map`)

- **コンポーネント**: Next.js Image
- **機能**: 名古屋市営地下鉄路線図表示
- **特徴**: レスポンシブ対応、外部画像使用

---

## 🗄️ データベース・API

### データベース構造

```sql
CREATE TABLE "Departure" (
  "id" SERIAL PRIMARY KEY,
  "time" TEXT NOT NULL,           -- 発車時刻 "HH:MM"
  "destination" TEXT NOT NULL,    -- 行き先
  "direction" TEXT NOT NULL,      -- "up"/"down"
  "dayType" TEXT NOT NULL,        -- "weekday"/"holiday"
  "remark" TEXT                   -- 備考
);
```

### API エンドポイント

#### `GET /api/trains`

**機能**: 電車データの取得

- 現在日時での平日・休日自動判定
- 上り・下り両方向のデータを取得
- Prisma ORM 使用

**レスポンス**:

```typescript
{
  upTrains: DepartureType[];
  downTrains: DepartureType[];
}
```

---

## 🎯 開発者向けのポイント

### 1. **コンポーネントの責務分離**

- 表示用コンポーネントとロジック用コンポーネントを分離
- 再利用可能なコンポーネント設計

### 2. **効率的な状態管理**

- Jotai による軽量な状態管理
- 必要な場所でのみ状態を購読

### 3. **型安全性**

- TypeScript による型定義
- プロップスとデータ構造の型チェック

### 4. **パフォーマンス最適化**

- Next.js App Router の活用
- 適切なクライアント・サーバーコンポーネント分離

### 5. **ユーザビリティ**

- レスポンシブデザイン
- 直感的なナビゲーション
- エラーハンドリング

---

## 🔧 カスタムフック

### `useCurrentTime.ts`

現在時刻の取得と自動更新

### `useFormat.ts`

時刻や電車情報のフォーマット処理

### `useTrains.ts`

電車データの取得と管理

---

## 🌟 特徴的な機能

1. **リアルタイム更新**: 現在時刻の自動更新とカウントダウン
2. **学生向け機能**: 授業終了時間からの電車検索
3. **直感的 UI**: 色分けされた方向表示（上り：青、下り：緑）
4. **平日・休日対応**: 自動的な時刻表切り替え
5. **レスポンシブ**: モバイル・デスクトップ対応
6. **型安全性**: TypeScript enum を使用した型安全な状態管理

## 🔧 型定義（TypeScript Enums）

### `Direction`

```typescript
enum Direction {
  Up = "up",
  Down = "down",
}
```

### `TimeStatus`

```typescript
enum TimeStatus {
  Past = "past",
  Next = "next",
  Future = "future",
}
```

### `TrainEndpoint`

```typescript
enum TrainEndpoint {
  Regular = "regular",
  First = "first",
  Last = "last",
}
```

これらの enum により、電車の状態を型安全に管理し、コードの可読性と保守性を向上させています。

このアプリケーションは、実用性とユーザビリティを重視した設計になっており、塩釜口駅を利用する人々にとって非常に便利なツールとなっています。
