#!/bin/bash
set -e # 遇到错误立即退出

# 清理旧构建产物
OUTPUT_DIR=".output"
rm -rf ${OUTPUT_DIR}
mkdir -p ${OUTPUT_DIR}

# 构建gif包
echo 'pnpm --filter @ge/gif build'
pnpm --filter @ge/gif build

# 构建editor应用
echo "pnpm --filter @ge/editor generate"
pnpm --filter @ge/editor generate

# 移动editor产物到根目录dist 
echo "mv .output/public/"
rsync -a packages/editor/.output/public/ ${OUTPUT_DIR}/
