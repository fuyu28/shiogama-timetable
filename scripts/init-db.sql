-- PostgreSQL初期化スクリプト
-- このスクリプトはDocker起動時に自動実行されます

-- データベースが存在しない場合のみ作成
SELECT 'CREATE DATABASE timetable_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'timetable_dev');

-- 必要に応じて拡張機能を有効化
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 初期化完了メッセージ
SELECT 'Database initialized successfully' AS message;