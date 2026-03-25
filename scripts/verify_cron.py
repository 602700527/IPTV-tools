import json
with open(r'C:\Users\60270\.openclaw-autoclaw\cron\jobs.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)
for j in jobs['jobs']:
    print("ID: " + j['id'])
    print("  Name: " + j['name'])
    print("  Schedule: " + j['schedule']['expr'] + " (" + j['schedule']['tz'] + ")")
    next_run = j['state'].get('nextRunAtMs')
    if next_run:
        import datetime
        dt = datetime.datetime.fromtimestamp(next_run/1000, tz=datetime.timezone(datetime.timedelta(hours=8)))
        print("  Next run: " + str(dt))
    print("")
