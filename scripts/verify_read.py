import json
import os
from gl import make_client, read

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load_addr():
    dep = os.path.join(ROOT, "deployment.json")
    if os.path.exists(dep):
        return json.load(open(dep, encoding="utf-8"))["contract_address"]
    raise SystemExit("deployment.json not found; deploy first")


ADDR = load_addr()
client, account = make_client()

print("contract:", ADDR)
print("get_stats ->", read(client, account, ADDR, "get_stats"))
print("get_artifacts(0) ->", read(client, account, ADDR, "get_artifacts", [0]))
print("get_issuance(0) ->", read(client, account, ADDR, "get_issuance", [0]))
