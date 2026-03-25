import json
import uuid
import time

with open(r'C:\Users\60270\.openclaw-autoclaw\cron\jobs.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

new_job = {
    "id": "34019f8c-a90a-48db-a089-b1d63ab53a8f",
    "name": "每周SEO健康审查",
    "description": "每周日早上6点自动运行，审查网站SEO状态并报告",
    "enabled": True,
    "createdAtMs": int(time.time() * 1000),
    "updatedAtMs": int(time.time() * 1000),
    "schedule": {
        "kind": "cron",
        "expr": "0 6 * * 0",
        "tz": "Asia/Shanghai"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
        "kind": "systemEvent",
        "text": "[CRON] 每周SEO健康审查。你必须执行以下步骤：\n\n1. 调用 SEO 专家 Sub-Agent（sessions_spawn）分析 iptv-search.com 当前 SEO 状态，包括：\n   - 抓取网站页面检查 title/description/og 标签是否正确\n   - 检查是否有新的 SEO 问题（如死链、重复内容、Schema 错误）\n   - 分析关键词排名和收录情况（通过公开数据）\n   - 对比上周状态，判断是否有退化\n\n2. 如果发现问题：\n   - 生成「SEO优化方案」发飞书给我（老板），内容包括：问题描述、修改清单、预计效果\n   - 明确标注「需要你审批后才执行」\n   - 等待我回复「可以做」再调用执行 Sub-Agent 落地改动\n\n3. 如果无问题：\n   - 发飞书简单周报：收录量、排名变化、流量估算（如果有数据）\n   - 报告格式简洁，一页看完\n\n4. 完成所有操作后回复 NO_REPLY。\n\n重要提醒：\n- 数据来源使用公开可查的 SEO 数据，不依赖付费 API\n- 如果 Sub-Agent 超时，先保存已有的中间结果，再重新调用\n- 所有改动必须等我明确授权才执行，不要自行决定落地\n"
    },
    "state": {
        "nextRunAtMs": 1774735200000,  # 2026-03-29 06:00 Asia/Shanghai
        "lastRunAtMs": None,
        "lastRunStatus": None,
        "lastStatus": None,
        "lastDurationMs": None,
        "lastDeliveryStatus": None,
        "consecutiveErrors": 0
    }
}

jobs['jobs'].append(new_job)

with open(r'C:\Users\60270\.openclaw-autoclaw\cron\jobs.json', 'w', encoding='utf-8') as f:
    json.dump(jobs, f, ensure_ascii=False, indent=2)

print("Done! Jobs count:", len(jobs['jobs']))
print("New job ID:", new_job['id'])
print("Next run: 2026-03-29 06:00 Asia/Shanghai")
