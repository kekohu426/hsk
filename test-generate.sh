#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNmE0YmVlMC1lYmQ4LTQ2ZGMtYjc1Mi0wMDE4Zjk3ZDdmMmQiLCJlbWFpbCI6ImFkbWluQGNoaW5lc2VtYXN0ZXIuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzYxMDM0NzIxLCJleHAiOjE3NjE2Mzk1MjF9.iorzfVVCFp0ceO-yMCPkYZSYrXSI8ixYGSbTJnaB6Cg"

# 测试生成"老师"这个词条
curl -N -X POST http://localhost:3000/api/admin/words/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"wordIds":["16b89bd6-db8b-4a1e-abf1-bd5569db44a8"]}'

